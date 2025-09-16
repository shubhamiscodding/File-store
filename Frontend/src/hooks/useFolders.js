import { useEffect, useState } from "react";
import { useApiClient } from "../utils/api";

export default function useFolders() {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { apiFetch } = useApiClient();

  const fetchFolders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiFetch("/folders");
      setFolders(data);
    } catch (err) {
      console.error("Fetch folders error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createFolder = async (name, parentFolder = null) => {
    try {
      const newFolder = await apiFetch("/folders", {
        method: "POST",
        body: JSON.stringify({ name, parentFolder }),
      });
      setFolders(prev => [...prev, newFolder]);
      return newFolder;
    } catch (err) {
      console.error("Create folder error:", err);
      throw err;
    }
  };

  const renameFolder = async (id, name) => {
    try {
      const updatedFolder = await apiFetch(`/folders/${id}`, {
        method: "PUT",
        body: JSON.stringify({ name }),
      });
      setFolders(prev => prev.map(folder => 
        folder._id === id ? updatedFolder : folder
      ));
      return updatedFolder;
    } catch (err) {
      console.error("Rename folder error:", err);
      throw err;
    }
  };

  const deleteFolder = async (id) => {
    try {
      await apiFetch(`/folders/${id}`, {
        method: "DELETE",
      });
      setFolders(prev => prev.filter(folder => folder._id !== id));
    } catch (err) {
      console.error("Delete folder error:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  return { 
    folders, 
    loading, 
    error,
    fetchFolders, 
    createFolder, 
    renameFolder, 
    deleteFolder 
  };
}
