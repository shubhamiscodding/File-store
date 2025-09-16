import { useState } from "react";
import useFolders from "../hooks/useFolders";
import useFiles from "../hooks/useFiles";
import Sidebar from "../components/Sidebar";
import FolderItem from "../components/FolderItem";
import FileItem from "../components/FileItem";
import FileUpload from "../components/FileUpload";
import SearchBar from "../components/SearchBar";
import CreateFolderModal from "../components/CreateFolderModal";

export default function Dashboard() {
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchResults, setSearchResults] = useState({ files: [], folders: [] });
  const [searchQuery, setSearchQuery] = useState("");

  const { 
    folders, 
    loading: foldersLoading, 
    createFolder, 
    renameFolder, 
    deleteFolder 
  } = useFolders();
  
  const { 
    files, 
    loading: filesLoading, 
    uploadFiles, 
    renameFile, 
    deleteFile, 
    downloadFile, 
    shareFile 
  } = useFiles(currentFolderId);

  const handleSearchResults = (results, query) => {
    setSearchResults(results);
    setSearchQuery(query);
  };

  const handleFolderOpen = (folder) => {
    setCurrentFolderId(folder._id);
  };

  const handleCreateFolder = async (name, parentFolder) => {
    await createFolder(name, parentFolder);
  };

  const displayFolders = searchQuery ? searchResults.folders : folders;
  const displayFiles = searchQuery ? searchResults.files : files;

  if (foldersLoading || filesLoading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <svg className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600">Loading your files...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {searchQuery ? `Search Results for "${searchQuery}"` : "My Files"}
              </h1>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>New Folder</span>
                </button>
              </div>
            </div>

            {/* Breadcrumb */}
            {currentFolderId && !searchQuery && (
              <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                <button
                  onClick={() => setCurrentFolderId(null)}
                  className="hover:text-blue-600"
                >
                  Home
                </button>
                <span>/</span>
                <span className="text-gray-900">Current Folder</span>
              </nav>
            )}
          </div>

          {/* Search Bar */}
          <SearchBar 
            onResultsChange={handleSearchResults} 
            folderId={currentFolderId} 
          />

          {/* File Upload */}
          {!searchQuery && (
            <FileUpload 
              onUpload={uploadFiles} 
              folderId={currentFolderId} 
            />
          )}

          {/* Content Grid */}
          <div className="space-y-8">
            {/* Folders Section */}
            {displayFolders.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  </svg>
                  Folders ({displayFolders.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {displayFolders.map((folder) => (
                    <FolderItem
                      key={folder._id}
                      folder={folder}
                      onRename={renameFolder}
                      onDelete={deleteFolder}
                      onOpen={handleFolderOpen}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Files Section */}
            {displayFiles.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                  Files ({displayFiles.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {displayFiles.map((file) => (
                    <FileItem
                      key={file._id}
                      file={file}
                      onRename={renameFile}
                      onDelete={deleteFile}
                      onDownload={downloadFile}
                      onShare={shareFile}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!searchQuery && displayFolders.length === 0 && displayFiles.length === 0 && (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No files yet</h3>
                <p className="text-gray-500 mb-6">Get started by uploading your first file or creating a folder.</p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Create Folder
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Folder Modal */}
      <CreateFolderModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateFolder={handleCreateFolder}
        parentFolder={currentFolderId}
      />
    </div>
  );
}
