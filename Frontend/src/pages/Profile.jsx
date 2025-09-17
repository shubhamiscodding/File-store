import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import Navbar from "../components/Nav";
import api from "../utils/api";

export default function Profile() {
  const { user } = useUser();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/profile"); // backend must return current user
        setProfile(res.data);
      } catch (err) {
        console.error("Profile fetch error:", err.message);
      }
    };
    fetchProfile();
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">👤 Profile</h2>
        {profile ? (
          <div>
            <p><b>Name:</b> {profile.name}</p>
            <p><b>Email:</b> {profile.email}</p>
            <p><b>Clerk ID:</b> {profile.clerkId}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
}
