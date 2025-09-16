# File Manager Frontend

A modern, responsive file management application built with React, Vite, and Tailwind CSS.

## Features

- **File Management**: Upload, download, rename, delete, and organize files
- **Folder Management**: Create, rename, delete, and navigate folders
- **Search**: Full-text search across files and folders
- **Trash System**: Soft delete with restore functionality
- **Authentication**: Secure user authentication with Clerk
- **Responsive Design**: Works on desktop and mobile devices
- **Drag & Drop**: Easy file uploads with drag and drop support

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4
- **Authentication**: Clerk
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Icons**: Heroicons (via SVG)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend server running on port 5000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file with your Clerk configuration:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── FileItem.jsx    # Individual file display
│   ├── FolderItem.jsx  # Individual folder display
│   ├── FileUpload.jsx  # File upload component
│   ├── SearchBar.jsx   # Search functionality
│   ├── Sidebar.jsx     # Navigation sidebar
│   └── CreateFolderModal.jsx # Folder creation modal
├── hooks/              # Custom React hooks
│   ├── useFiles.js     # File management operations
│   ├── useFolders.js   # Folder management operations
│   ├── useTrash.js     # Trash operations
│   ├── useSearch.js    # Search functionality
│   ├── useSyncUser.js  # User synchronization
│   └── useLoginUser.js # User authentication
├── pages/              # Page components
│   ├── Dashboard.jsx   # Main file manager interface
│   ├── Trash.jsx       # Trash management page
│   ├── SignInPage.jsx  # Sign in page
│   └── SignUpPage.jsx  # Sign up page
├── utils/              # Utility functions
│   └── api.js          # API client with authentication
├── App.jsx             # Main app component
├── main.jsx            # App entry point
└── index.css           # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The frontend connects to a Node.js/Express backend with the following endpoints:

- `GET /api/files` - List files
- `POST /api/files/upload` - Upload files
- `PUT /api/files/:id` - Rename file
- `DELETE /api/files/:id` - Delete file
- `GET /api/folders` - List folders
- `POST /api/folders` - Create folder
- `PUT /api/folders/:id` - Rename folder
- `DELETE /api/folders/:id` - Delete folder
- `GET /api/search` - Search files and folders
- `GET /api/trash` - List trashed items
- `PUT /api/trash/restore/:id` - Restore item

## Authentication

User authentication is handled by Clerk. Users must sign in to access the file manager. The app automatically syncs user data with the backend MongoDB database.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
