import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles/index.css";

const root = document.getElementById("root");
if (!root) throw new Error("#root not found");

// Determine mode from URL query parameter
const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get("mode") || "sidebar"; // default to sidebar

// Create a version of App without the sidebar for "app" mode
function AppWrapper() {
  // In app mode, we might want to render a full-screen version without the side panel
  // For now, we'll just render the same App but we can customize it later
  return <App />;
}

createRoot(root).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>
);
