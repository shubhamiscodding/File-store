import { useAuth } from "@clerk/clerk-react";

const API_URL = "http://localhost:5000/api";

// Hook to get authenticated API fetch function
export const useApiClient = () => {
  const { getToken } = useAuth();

  const apiFetch = async (endpoint, options = {}) => {
    const token = await getToken();
    
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: { 
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
      },
      ...options,
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: "API Error" }));
      throw new Error(errorData.message || "API Error");
    }
    
    return res.json();
  };

  const uploadFile = async (formData, folderId = null) => {
    const token = await getToken();
    
    const res = await fetch(`${API_URL}/files/upload`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: "Upload Error" }));
      throw new Error(errorData.message || "Upload Error");
    }
    
    return res.json();
  };

  return { apiFetch, uploadFile };
};
