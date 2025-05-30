import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./grey-theme.css";

console.log("Main.tsx loaded, attempting to render app...");

try {
  const rootElement = document.getElementById("root");
  console.log("Root element found:", rootElement);
  
  if (rootElement) {
    createRoot(rootElement).render(<App />);
    console.log("App rendered successfully");
  } else {
    console.error("Root element not found!");
  }
} catch (error) {
  console.error("Error rendering app:", error);
}
