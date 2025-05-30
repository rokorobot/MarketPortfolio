// Minimal test without CSS imports that might cause issues
import { createRoot } from "react-dom/client";

function TestApp() {
  return (
    <div style={{ padding: '20px', fontSize: '24px', color: 'red', background: 'yellow' }}>
      <h1>React Test</h1>
      <p>If you see this, React is working</p>
    </div>
  );
}

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<TestApp />);
} else {
  document.body.innerHTML = '<h1 style="color: red;">Root element not found</h1>';
}
