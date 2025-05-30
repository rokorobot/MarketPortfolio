import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./grey-theme.css";

// Simple test to see if React renders at all
function TestApp() {
  return (
    <div style={{ padding: '20px', fontSize: '24px', color: 'red', background: 'yellow' }}>
      React is working! App should load below...
      <App />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<TestApp />);
