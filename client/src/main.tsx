// Add visible content directly to DOM first
document.body.style.background = 'red';
document.body.innerHTML = '<div style="padding: 20px; font-size: 24px; color: white;">JavaScript is running - checking React...</div>';

try {
  document.body.innerHTML = '<div style="padding: 20px; color: white; background: blue;">Loading React components...</div>';
  
  const { createRoot } = await import("react-dom/client");
  document.body.innerHTML = '<div style="padding: 20px; color: white; background: green;">React DOM loaded, loading App...</div>';
  
  // Try loading just React first without CSS
  const App = (await import("./App")).default;
  document.body.innerHTML = '<div style="padding: 20px; color: white; background: purple;">App component loaded, rendering...</div>';

  // Simple test component without CSS imports
  function TestApp() {
    return (
      <div style={{ padding: '20px', fontSize: '24px', color: 'black', background: 'yellow' }}>
        React is working! Loading full app...
        <App />
      </div>
    );
  }

  // Clear the test content and render React
  document.body.innerHTML = '<div id="root"></div>';
  createRoot(document.getElementById("root")!).render(<TestApp />);
  
} catch (error) {
  document.body.innerHTML = `<div style="padding: 20px; color: white; background: red;">Error loading React: ${error.message}<br/>Stack: ${error.stack}</div>`;
}
