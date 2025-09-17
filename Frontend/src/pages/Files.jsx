import { useEffect, useState } from "react";
import Navbar from "../components/Nav";
import api from "../utils/api";

export default function Files() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await api.get("/files"); // backend should have files route
        setFiles(res.data);
      } catch (err) {
        console.error("Error fetching files:", err.message);
      }
    };
    fetchFiles();
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">📂 Your Files</h2>
        <ul>
          {files.map((file) => (
            <li key={file._id}>{file.name}</li>
          ))}
        </ul>
      </div>
    </>
  );
}
