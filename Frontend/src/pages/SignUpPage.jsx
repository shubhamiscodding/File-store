// pages/SignUpPage.jsx
import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage() {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
      <SignUp routing="path" path="/signup" signInUrl="/login" />
    </div>
  );
}
