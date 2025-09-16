import { useState } from "react";

export default function FolderItem({ folder, onRename, onDelete, onOpen }) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(folder.name);

  const handleRename = async () => {
    if (newName.trim() && newName !== folder.name) {
      try {
        await onRename(folder._id, newName.trim());
        setIsRenaming(false);
      } catch (err) {
        alert("Failed to rename folder: " + err.message);
      }
    } else {
      setIsRenaming(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${folder.name}"?`)) {
      try {
        await onDelete(folder._id);
      } catch (err) {
        alert("Failed to delete folder: " + err.message);
      }
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 flex-1">
          <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
          </svg>
          
          {isRenaming ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRename();
                if (e.key === "Escape") setIsRenaming(false);
              }}
              className="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          ) : (
            <span 
              className="flex-1 cursor-pointer hover:text-blue-600"
              onClick={() => onOpen && onOpen(folder)}
              onDoubleClick={() => setIsRenaming(true)}
            >
              {folder.name}
            </span>
          )}
        </div>
        
        <div className="flex space-x-1">
          <button
            onClick={() => setIsRenaming(true)}
            className="p-1 text-gray-500 hover:text-blue-500 rounded"
            title="Rename"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          
          <button
            onClick={handleDelete}
            className="p-1 text-gray-500 hover:text-red-500 rounded"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        Created: {new Date(folder.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}
