import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ClerkProvider } from "@clerk/clerk-react";

const clerkPubKey = "YOUR_CLERK_FRONTEND_API_KEY"; // from Clerk dashboard

ReactDOM.createRoot(document.getElementById("root")).render(
  <ClerkProvider frontendApi={clerkPubKey}>
    <App />
  </ClerkProvider>
);
