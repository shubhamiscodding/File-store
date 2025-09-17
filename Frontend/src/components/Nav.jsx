import { UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-200 shadow-md">
      <h1 className="text-xl font-bold">📂 File Manager</h1>
      <div className="flex gap-4">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/files">Files</Link>
        <Link to="/folders">Folders</Link>   {/* <-- added */}
        <Link to="/profile">Profile</Link>
        <UserButton afterSignOutUrl="/login" />
      </div>
    </nav>
  );
}
