// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

import AuthHandler from "./components/AuthHandler";
import Dashboard from "./pages/Dashboard";
import Files from "./pages/Files";
import Folders from "./pages/Folder";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <AuthHandler />

      <Routes>
        <Route
          path="/dashboard"
          element={
            <SignedIn>
              <Dashboard />
            </SignedIn>
          }
        />
        <Route
          path="/files"
          element={
            <SignedIn>
              <Files />
            </SignedIn>
          }
        />
        <Route
          path="/folders"
          element={
            <SignedIn>
              <Folders />
            </SignedIn>
          }
        />
        <Route
          path="/profile"
          element={
            <SignedIn>
              <Profile />
            </SignedIn>
          }
        />

        {/* Signed out users always go to Clerk’s sign-in */}
        <Route
          path="*"
          element={
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
