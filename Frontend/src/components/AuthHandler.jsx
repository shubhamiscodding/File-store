// src/components/AuthHandler.jsx
import { useUser } from "@clerk/clerk-react";
import { useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function AuthHandler() {
  const { isSignedIn, user, isLoaded } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const hasSynced = useRef(false); // prevent infinite syncs

  useEffect(() => {
    // Wait until Clerk is fully loaded
    if (!isLoaded) return;

    if (isSignedIn && user && !hasSynced.current) {
      hasSynced.current = true; // mark synced

      const syncUserToBackend = async () => {
        try {
          await axios.post("http://localhost:5000/api/users/register", {
            name: user.fullName || "No Name",
            email: user.primaryEmailAddress.emailAddress,
            clerkId: user.id,
          });
        } catch (err) {
          const msg = err.response?.data?.message || err.message;
          if (msg !== "User already exists") {
            console.error("Error syncing user:", msg);
          }
        }

        // Redirect only if not already on dashboard
        if (location.pathname === "/") {
          navigate("/dashboard", { replace: true });
        }
      };

      syncUserToBackend();
    }
  }, [isSignedIn, user, isLoaded, navigate, location]);

  return null;
}
