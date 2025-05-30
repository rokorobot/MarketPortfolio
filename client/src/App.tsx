import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

// Start with minimal components first
function SimpleHome() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Portfolio Home</h1>
      <p>Home page loaded successfully</p>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={SimpleHome} />
      <Route>
        <div>Page not found</div>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;