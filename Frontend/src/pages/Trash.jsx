import useTrash from "../hooks/useTrash";
import FileItem from "../components/FileItem";
import FolderItem from "../components/FolderItem";

export default function Trash() {
  const { files, folders, loading } = useTrash();

  if (loading) return <p>Loading trash...</p>;

  return (
    <div className="p-4">
      <h2>Trashed Folders</h2>
      <div className="grid grid-cols-4 gap-4">
        {folders.map((folder) => (
          <FolderItem key={folder._id} folder={folder} />
        ))}
      </div>

      <h2 className="mt-6">Trashed Files</h2>
      <div className="grid grid-cols-4 gap-4">
        {files.map((file) => (
          <FileItem key={file._id} file={file} />
        ))}
      </div>
    </div>
  );
}
