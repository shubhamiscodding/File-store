import { useEffect, useState } from "react";
import { useApiClient } from "../utils/api";

export default function useFiles(folderId = null) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { apiFetch, uploadFile } = useApiClient();

  const fetchFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const queryParam = folderId ? `?folderId=${folderId}` : "";
      const data = await apiFetch(`/files${queryParam}`);
      setFiles(data);
    } catch (err) {
      console.error("Fetch files error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadFiles = async (fileList, targetFolderId = null) => {
    try {
      const uploadPromises = Array.from(fileList).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        if (targetFolderId) {
          formData.append("folderId", targetFolderId);
        }
        return uploadFile(formData);
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      setFiles(prev => [...prev, ...uploadedFiles]);
      return uploadedFiles;
    } catch (err) {
      console.error("Upload files error:", err);
      throw err;
    }
  };

  const renameFile = async (id, name) => {
    try {
      const updatedFile = await apiFetch(`/files/${id}`, {
        method: "PUT",
        body: JSON.stringify({ name }),
      });
      setFiles(prev => prev.map(file => 
        file._id === id ? updatedFile : file
      ));
      return updatedFile;
    } catch (err) {
      console.error("Rename file error:", err);
      throw err;
    }
  };

  const moveFile = async (fileId, folderId) => {
    try {
      const updatedFile = await apiFetch("/files/move", {
        method: "POST",
        body: JSON.stringify({ fileId, folderId }),
      });
      setFiles(prev => prev.filter(file => file._id !== fileId));
      return updatedFile;
    } catch (err) {
      console.error("Move file error:", err);
      throw err;
    }
  };

  const deleteFile = async (id) => {
    try {
      await apiFetch(`/files/${id}`, {
        method: "DELETE",
      });
      setFiles(prev => prev.filter(file => file._id !== id));
    } catch (err) {
      console.error("Delete file error:", err);
      throw err;
    }
  };

  const downloadFile = async (id, filename) => {
    try {
      const response = await fetch(`http://localhost:5000/api/files/${id}/download`, {
        headers: {
          Authorization: `Bearer ${await useApiClient().getToken()}`,
        },
      });
      
      if (!response.ok) throw new Error("Download failed");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Download file error:", err);
      throw err;
    }
  };

  const shareFile = async (id) => {
    try {
      const response = await apiFetch(`/files/${id}/share`, {
        method: "POST",
      });
      return response.shareLink;
    } catch (err) {
      console.error("Share file error:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [folderId]);

  return { 
    files, 
    loading, 
    error,
    fetchFiles, 
    uploadFiles, 
    renameFile, 
    moveFile, 
    deleteFile, 
    downloadFile, 
    shareFile 
  };
}
