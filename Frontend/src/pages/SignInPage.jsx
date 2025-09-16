// pages/SignInPage.jsx
import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
      <SignIn routing="path" path="/login" signUpUrl="/signup" />
    </div>
  );
}
