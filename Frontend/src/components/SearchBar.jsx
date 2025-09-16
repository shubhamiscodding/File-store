import { useState, useEffect } from "react";
import useSearch from "../hooks/useSearch";

export default function SearchBar({ onResultsChange, folderId = null }) {
  const [query, setQuery] = useState("");
  const { results, loading, search, clearResults } = useSearch();

  const handleSearch = async (searchQuery) => {
    setQuery(searchQuery);
    
    if (searchQuery.trim()) {
      await search(searchQuery, folderId);
    } else {
      clearResults();
    }
  };

  // Notify parent component of results changes
  useEffect(() => {
    if (onResultsChange) {
      onResultsChange(results, query);
    }
  }, [results, query, onResultsChange]);

  return (
    <div className="mb-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search files and folders..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <svg className="w-5 h-5 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
        
        {query && (
          <button
            onClick={() => handleSearch("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      {query && (results.files.length > 0 || results.folders.length > 0) && (
        <div className="mt-2 text-sm text-gray-600">
          Found {results.files.length} files and {results.folders.length} folders
        </div>
      )}
      
      {query && results.files.length === 0 && results.folders.length === 0 && !loading && (
        <div className="mt-2 text-sm text-gray-500">
          No results found for "{query}"
        </div>
      )}
    </div>
  );
}
