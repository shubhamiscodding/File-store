// src/hooks/useLoginUser.js
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";

const API_URL = "http://localhost:5000/api/users";

export default function useLoginUser() {
  const { user, isSignedIn } = useUser();
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isSignedIn || !user) return;

    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clerkId: user.id }),
        });

        if (!res.ok) throw new Error("Failed to fetch MongoDB user");

        const data = await res.json();
        setDbUser(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [isSignedIn, user]);

  return { dbUser, loading, error };
}
