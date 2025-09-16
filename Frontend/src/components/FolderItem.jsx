import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";

export default function useFolders() {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFolders = async () => {
    try {
      const data = await apiFetch("/folders");
      setFolders(data);
    } catch (err) {
      console.error("Fetch folders error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  return { folders, loading, fetchFolders };
}
