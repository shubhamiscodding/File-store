// pages/Dashboard.jsx
import { useUser } from "@clerk/clerk-react";

export default function Dashboard() {
  const { user } = useUser();

  return (
    <div>
      <h1>Welcome, {user?.firstName || user?.fullName} 👋</h1>
      <p>Email: {user?.primaryEmailAddress?.emailAddress}</p>
    </div>
  );
}
