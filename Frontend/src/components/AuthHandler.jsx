import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";

export default function AuthHandler() {
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    const syncUserToBackend = async () => {
      if (!isSignedIn || !user) return;

      try {
        // Call your backend API to create/check user in DB
        await axios.post("http://localhost:5000/api/users/register", {
          email: user.primaryEmailAddress.emailAddress,
          name: user.fullName || "No Name",
          clerkId: user.id,
        });

        console.log("User synced with backend ✅");
      } catch (error) {
        console.error("Error syncing user:", error.response?.data || error.message);
      }
    };

    syncUserToBackend();
  }, [isSignedIn, user]);

  return null; // invisible helper component
}
