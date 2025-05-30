// Add visible content directly to DOM first
document.body.style.background = 'red';
document.body.innerHTML = '<div style="padding: 20px; font-size: 24px; color: white;">JavaScript is running - checking React...</div>';

try {
  const { createRoot } = await import("react-dom/client");
  const App = (await import("./App")).default;
  await import("./index.css");
  await import("./grey-theme.css");

  // Simple test component
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
  document.body.innerHTML = `<div style="padding: 20px; color: white; background: red;">Error loading React: ${error.message}</div>`;
}
