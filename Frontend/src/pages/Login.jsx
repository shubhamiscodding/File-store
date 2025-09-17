import { SignIn } from "@clerk/clerk-react";

export default function Login() {
  return (
    <div className="flex items-center justify-center h-screen">
      <SignIn routing="path" path="/login" />
    </div>
  );
}
