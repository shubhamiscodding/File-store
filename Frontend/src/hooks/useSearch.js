import { useState } from "react";
import { useApiClient } from "../utils/api";

export default function useSearch() {
  const [results, setResults] = useState({ files: [], folders: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { apiFetch } = useApiClient();

  const search = async (query, folderId = null) => {
    if (!query.trim()) {
      setResults({ files: [], folders: [] });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const queryParam = new URLSearchParams({ query });
      if (folderId) queryParam.append("folderId", folderId);
      
      const data = await apiFetch(`/search?${queryParam}`);
      setResults(data);
    } catch (err) {
      console.error("Search error:", err);
      setError(err.message);
      setResults({ files: [], folders: [] });
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults({ files: [], folders: [] });
    setError(null);
  };

  return { 
    results, 
    loading, 
    error, 
    search, 
    clearResults 
  };
}
