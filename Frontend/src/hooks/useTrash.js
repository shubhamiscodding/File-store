import { useEffect, useState } from "react";
import { useApiClient } from "../utils/api";

export default function useTrash() {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { apiFetch } = useApiClient();

  const fetchTrashItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiFetch("/trash");
      setFiles(data.files || []);
      setFolders(data.folders || []);
    } catch (err) {
      console.error("Fetch trash error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const restoreItem = async (id, type) => {
    try {
      await apiFetch(`/trash/restore/${id}`, {
        method: "PUT",
        body: JSON.stringify({ type }),
      });
      
      if (type === "file") {
        setFiles(prev => prev.filter(file => file._id !== id));
      } else {
        setFolders(prev => prev.filter(folder => folder._id !== id));
      }
    } catch (err) {
      console.error("Restore item error:", err);
      throw err;
    }
  };

  const permanentlyDelete = async (id, type) => {
    try {
      await apiFetch(`/trash/${id}`, {
        method: "DELETE",
        body: JSON.stringify({ type }),
      });
      
      if (type === "file") {
        setFiles(prev => prev.filter(file => file._id !== id));
      } else {
        setFolders(prev => prev.filter(folder => folder._id !== id));
      }
    } catch (err) {
      console.error("Permanently delete error:", err);
      throw err;
    }
  };

  const restoreMultiple = async (fileIds = [], folderIds = []) => {
    try {
      await apiFetch("/trash/restore", {
        method: "PUT",
        body: JSON.stringify({ files: fileIds, folders: folderIds }),
      });
      
      setFiles(prev => prev.filter(file => !fileIds.includes(file._id)));
      setFolders(prev => prev.filter(folder => !folderIds.includes(folder._id)));
    } catch (err) {
      console.error("Restore multiple error:", err);
      throw err;
    }
  };

  const restoreAll = async () => {
    try {
      await apiFetch("/trash/restore-all", {
        method: "PUT",
      });
      
      setFiles([]);
      setFolders([]);
    } catch (err) {
      console.error("Restore all error:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchTrashItems();
  }, []);

  return { 
    files, 
    folders, 
    loading, 
    error,
    fetchTrashItems, 
    restoreItem, 
    permanentlyDelete, 
    restoreMultiple, 
    restoreAll 
  };
}
