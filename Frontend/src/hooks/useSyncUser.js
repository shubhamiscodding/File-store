// src/hooks/useSyncUser.js
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";

const API_URL = "http://localhost:5000/api/users"; // backend URL

export default function useSyncUser() {
  const { user, isSignedIn } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isSignedIn || !user) return;

    const syncUser = async () => {
      setLoading(true);
      try {
        const name = user.fullName;
        const email = user.primaryEmailAddress?.emailAddress;
        const clerkId = user.id;

        if (!name || !email || !clerkId) {
          throw new Error("Incomplete Clerk user data");
        }

        // Try to register user
        const res = await fetch(`${API_URL}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, clerkId }),
        });

        if (!res.ok) {
          const data = await res.json();

          // If user already exists, just fetch it instead of throwing an error
          if (data.message === "User already exists") {
            const loginRes = await fetch(`${API_URL}/login`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ clerkId }),
            });
            const existingUser = await loginRes.json();
            console.log("Existing user fetched from MongoDB:", existingUser);
            setLoading(false);
            return;
          }

          throw new Error(data.message || "Failed to sync user");
        }

        const savedUser = await res.json();
        console.log("User stored in MongoDB:", savedUser);
      } catch (err) {
        console.error("Error syncing user:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    syncUser();
  }, [isSignedIn, user]);

  return { loading, error };
}
