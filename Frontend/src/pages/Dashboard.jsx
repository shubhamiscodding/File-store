import useFolders from "../hooks/useFolders";
import useFiles from "../hooks/useFiles";
import Sidebar from "../components/Sidebar";
import FolderItem from "../components/FolderItem";
import FileItem from "../components/FileItem";

export default function Dashboard() {
  const { folders, loading: foldersLoading } = useFolders();
  const { files, loading: filesLoading } = useFiles();

  if (foldersLoading || filesLoading) return <p>Loading...</p>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-4 flex-1">
        <h2>Folders</h2>
        <div className="grid grid-cols-4 gap-4">
          {folders.map((folder) => (
            <FolderItem key={folder._id} folder={folder} />
          ))}
        </div>

        <h2 className="mt-6">Files</h2>
        <div className="grid grid-cols-4 gap-4">
          {files.map((file) => (
            <FileItem key={file._id} file={file} />
          ))}
        </div>
      </div>
    </div>
  );
}
