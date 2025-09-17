import { useEffect, useState } from "react";
import Navbar from "../components/Nav";
import api from "../utils/api";

export default function Folders() {
  const [parentId, setParentId] = useState(null); // null => root
  const [breadcrumb, setBreadcrumb] = useState([{ id: null, name: "Root" }]);
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchContents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentId]);

  const fetchContents = async () => {
    try {
      setLoading(true);
      const [fRes, fileRes] = await Promise.all([
        api.get("/folders", { params: { parentId } }),
        api.get("/files", { params: { folderId: parentId } }),
      ]);
      setFolders(fRes.data || []);
      setFiles(fileRes.data || []);
    } catch (err) {
      console.error("Error fetching folder contents:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const createFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    try {
      await api.post("/folders", { name: newFolderName.trim(), parentId });
      setNewFolderName("");
      fetchContents();
    } catch (err) {
      console.error("Create folder error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Create folder failed");
    }
  };

  const openFolder = (folder) => {
    setParentId(folder._id);
    setBreadcrumb((b) => [...b, { id: folder._id, name: folder.name }]);
  };

  const goToBreadcrumb = (index) => {
    const item = breadcrumb[index];
    setBreadcrumb((prev) => prev.slice(0, index + 1));
    setParentId(item.id);
  };

  const renameFolder = async (folder) => {
    const newName = prompt("Rename folder", folder.name);
    if (!newName || newName.trim() === folder.name) return;
    try {
      await api.put(`/folders/${folder._id}`, { name: newName.trim() });
      fetchContents();
    } catch (err) {
      console.error("Rename error:", err.response?.data || err.message);
    }
  };

  const deleteFolder = async (folder) => {
    if (!confirm(`Delete folder "${folder.name}"? This may delete contents.`)) return;
    try {
      await api.delete(`/folders/${folder._id}`);
      fetchContents();
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
    }
  };

  const uploadFile = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const form = new FormData();
    form.append("file", f);
    if (parentId) form.append("folderId", parentId);

    try {
      await api.post("/files/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      e.target.value = null;
      fetchContents();
    } catch (err) {
      console.error("Upload error:", err.response?.data || err.message);
      alert("Upload failed");
    }
  };

  const deleteFile = async (file) => {
    if (!confirm(`Delete file "${file.name}"?`)) return;
    try {
      await api.delete(`/files/${file._id}`);
      fetchContents();
    } catch (err) {
      console.error("Delete file error:", err.response?.data || err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">📁 Folders</h2>

        {/* Breadcrumb */}
        <div className="mb-4 text-sm">
          {breadcrumb.map((b, i) => (
            <span key={b.id ?? "root"}>
              <button
                className="underline mr-2"
                onClick={() => goToBreadcrumb(i)}
              >
                {b.name}
              </button>
              {i < breadcrumb.length - 1 && <span> / </span>}
            </span>
          ))}
        </div>

        {/* Create folder + Upload file */}
        <div className="flex gap-4 items-center mb-6">
          <form onSubmit={createFolder} className="flex gap-2 items-center">
            <input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="New folder name"
              className="border px-2 py-1 rounded"
            />
            <button className="px-3 py-1 bg-blue-600 text-white rounded" type="submit">
              Create
            </button>
          </form>

          <label className="cursor-pointer px-3 py-1 bg-green-600 text-white rounded">
            Upload file
            <input type="file" onChange={uploadFile} className="hidden" />
          </label>
        </div>

        {loading ? <p>Loading...</p> : null}

        {/* Folders */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Folders</h3>
          {folders.length === 0 ? <p className="text-sm">No folders</p> : null}
          <ul>
            {folders.map((f) => (
              <li key={f._id} className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center gap-3">
                  <button onClick={() => openFolder(f)} className="underline">
                    📁 {f.name}
                  </button>
                  <span className="text-xs text-gray-500"> • {f.itemsCount ?? ""}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => renameFolder(f)} className="text-sm underline">Rename</button>
                  <button onClick={() => deleteFolder(f)} className="text-sm text-red-600">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Files */}
        <div>
          <h3 className="font-semibold mb-2">Files</h3>
          {files.length === 0 ? <p className="text-sm">No files in this folder</p> : null}
          <ul>
            {files.map((file) => (
              <li key={file._id} className="flex items-center justify-between py-2 border-b">
                <div>
                  <a href={file.downloadUrl || `/api/files/download/${file._id}`} target="_blank" rel="noreferrer" className="underline">
                    {file.name}
                  </a>
                  <div className="text-xs text-gray-500">{(file.size/1024).toFixed(1)} KB</div>
                </div>
                <div className="flex gap-2">
                  <a href={file.downloadUrl || `/api/files/download/${file._id}`} className="text-sm underline" target="_blank" rel="noreferrer">Download</a>
                  <button onClick={() => deleteFile(file)} className="text-sm text-red-600">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
