import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import Navbar from "../components/Nav";
import api from "../utils/api";

export default function Files() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth(); // Clerk hook for JWT

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        const token = await getToken({ template: "default" });
        const res = await api.get("/files", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFiles(res.data);
      } catch (err) {
        console.error("Error fetching files:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, [getToken]);

  const deleteFile = async (file) => {
    if (!confirm(`Delete file "${file.name}"?`)) return;
    try {
      const token = await getToken({ template: "default" });
      await api.delete(`/files/${file._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles((prev) => prev.filter((f) => f._id !== file._id));
    } catch (err) {
      console.error("Delete file error:", err.response?.data || err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">📂 Your Files</h2>
        {loading && <p>Loading files...</p>}
        {files.length === 0 && !loading && <p className="text-sm">No files found</p>}
        <ul>
          {files.map((file) => (
            <li key={file._id} className="flex items-center justify-between py-2 border-b">
              <div>
                <a
                  href={file.downloadUrl || `/api/files/download/${file._id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  {file.name}
                </a>
                <div className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</div>
              </div>
              <button
                onClick={() => deleteFile(file)}
                className="text-sm text-red-600"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
