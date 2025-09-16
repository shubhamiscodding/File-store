import { useState } from "react";
import useTrash from "../hooks/useTrash";
import Sidebar from "../components/Sidebar";
import FileItem from "../components/FileItem";
import FolderItem from "../components/FolderItem";

export default function Trash() {
  const [selectedItems, setSelectedItems] = useState({ files: [], folders: [] });
  const { 
    files, 
    folders, 
    loading, 
    restoreItem, 
    permanentlyDelete, 
    restoreMultiple, 
    restoreAll 
  } = useTrash();

  const handleSelectFile = (fileId, checked) => {
    setSelectedItems(prev => ({
      ...prev,
      files: checked 
        ? [...prev.files, fileId]
        : prev.files.filter(id => id !== fileId)
    }));
  };

  const handleSelectFolder = (folderId, checked) => {
    setSelectedItems(prev => ({
      ...prev,
      folders: checked 
        ? [...prev.folders, folderId]
        : prev.folders.filter(id => id !== folderId)
    }));
  };

  const handleSelectAll = () => {
    const allSelected = selectedItems.files.length === files.length && 
                       selectedItems.folders.length === folders.length;
    
    if (allSelected) {
      setSelectedItems({ files: [], folders: [] });
    } else {
      setSelectedItems({
        files: files.map(f => f._id),
        folders: folders.map(f => f._id)
      });
    }
  };

  const handleRestoreSelected = async () => {
    if (selectedItems.files.length === 0 && selectedItems.folders.length === 0) return;
    
    try {
      await restoreMultiple(selectedItems.files, selectedItems.folders);
      setSelectedItems({ files: [], folders: [] });
    } catch (err) {
      alert("Failed to restore items: " + err.message);
    }
  };

  const handleRestoreAll = async () => {
    if (window.confirm("Are you sure you want to restore all items from trash?")) {
      try {
        await restoreAll();
        setSelectedItems({ files: [], folders: [] });
      } catch (err) {
        alert("Failed to restore all items: " + err.message);
      }
    }
  };

  const TrashFileItem = ({ file }) => (
    <div className="relative">
      <div className="absolute top-2 left-2 z-10">
        <input
          type="checkbox"
          checked={selectedItems.files.includes(file._id)}
          onChange={(e) => handleSelectFile(file._id, e.target.checked)}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
      </div>
      <FileItem
        file={file}
        onRename={() => {}} // Disabled in trash
        onDelete={async (id) => await permanentlyDelete(id, "file")}
        onDownload={() => {}} // Disabled in trash
        onShare={() => {}} // Disabled in trash
      />
      <div className="absolute bottom-2 right-2">
        <button
          onClick={() => restoreItem(file._id, "file")}
          className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
        >
          Restore
        </button>
      </div>
    </div>
  );

  const TrashFolderItem = ({ folder }) => (
    <div className="relative">
      <div className="absolute top-2 left-2 z-10">
        <input
          type="checkbox"
          checked={selectedItems.folders.includes(folder._id)}
          onChange={(e) => handleSelectFolder(folder._id, e.target.checked)}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
      </div>
      <FolderItem
        folder={folder}
        onRename={() => {}} // Disabled in trash
        onDelete={async (id) => await permanentlyDelete(id, "folder")}
        onOpen={() => {}} // Disabled in trash
      />
      <div className="absolute bottom-2 right-2">
        <button
          onClick={() => restoreItem(folder._id, "folder")}
          className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
        >
          Restore
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <svg className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600">Loading trash...</p>
          </div>
        </div>
      </div>
    );
  }

  const totalItems = files.length + folders.length;
  const selectedCount = selectedItems.files.length + selectedItems.folders.length;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <svg className="w-6 h-6 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Trash ({totalItems} items)
              </h1>
              
              {totalItems > 0 && (
                <div className="flex space-x-3">
                  <button
                    onClick={handleSelectAll}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    {selectedCount === totalItems ? "Deselect All" : "Select All"}
                  </button>
                  
                  {selectedCount > 0 && (
                    <button
                      onClick={handleRestoreSelected}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                      <span>Restore Selected ({selectedCount})</span>
                    </button>
                  )}
                  
                  <button
                    onClick={handleRestoreAll}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                    <span>Restore All</span>
                  </button>
                </div>
              )}
            </div>
            
            <p className="text-gray-600">
              Items in trash will be permanently deleted after 30 days. You can restore them or delete them permanently.
            </p>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {/* Folders Section */}
            {folders.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  </svg>
                  Trashed Folders ({folders.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {folders.map((folder) => (
                    <TrashFolderItem key={folder._id} folder={folder} />
                  ))}
                </div>
              </div>
            )}

            {/* Files Section */}
            {files.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                  Trashed Files ({files.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {files.map((file) => (
                    <TrashFileItem key={file._id} file={file} />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {totalItems === 0 && (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Trash is empty</h3>
                <p className="text-gray-500">Deleted files and folders will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
