import { Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import useSyncUser from "./hooks/useSyncUser";
import useLoginUser from "./hooks/useLoginUser";
import Trash from "./pages/Trash";

function App() {
  useSyncUser(); // sync user to MongoDB
  const { dbUser, loading, error } = useLoginUser(); // fetch MongoDB user

  return (
    <>
      <SignedIn>
        {loading && <p>Loading user...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {dbUser && <p>Welcome, {dbUser.name}! 🎉</p>}

        <Routes>
          <Route path="/" element={<h1>Dashboard Page 🚀</h1>} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/trash" element={<Trash />} />
        </Routes>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

export default App;
