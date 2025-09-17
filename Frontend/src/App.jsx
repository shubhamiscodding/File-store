import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import AuthHandler from "./components/AuthHandler";
import Login from "./pages/Login";

function App() {
  return (
    <>
      <SignedIn>
        <AuthHandler />
        <h1>Welcome! 🎉</h1>
        {/* Your dashboard, file manager, etc. */}
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
        <Login />
      </SignedOut>
    </>
  );
}

export default App;
