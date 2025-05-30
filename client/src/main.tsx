import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./grey-theme.css";

console.log("Main.tsx loaded, attempting to render app...");

// Add a simple test div to verify JavaScript is running
const testDiv = document.createElement('div');
testDiv.innerHTML = 'JavaScript is working - App should load here';
testDiv.style.cssText = 'position: fixed; top: 10px; left: 10px; background: red; color: white; padding: 10px; z-index: 9999;';
document.body.appendChild(testDiv);

try {
  const rootElement = document.getElementById("root");
  console.log("Root element found:", rootElement);
  
  if (rootElement) {
    // Add visible styling to root to debug
    rootElement.style.cssText = 'min-height: 100vh; background: blue; border: 5px solid red;';
    createRoot(rootElement).render(<App />);
    console.log("App rendered successfully");
    // Remove test div after successful render
    setTimeout(() => testDiv.remove(), 2000);
  } else {
    console.error("Root element not found!");
  }
} catch (error) {
  console.error("Error rendering app:", error);
  testDiv.innerHTML = 'Error rendering app: ' + error.message;
}
