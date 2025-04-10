import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/home";
import Item from "@/pages/item";
import AddItem from "@/pages/add-item";
import AddCollection from "@/pages/add-collection";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/login";
import SharePage from "@/pages/share";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/item/:id" component={Item} />
      <Route path="/share/:shareCode" component={SharePage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/add-item">
        <ProtectedRoute requireAdmin>
          <AddItem />
        </ProtectedRoute>
      </Route>
      <Route path="/add-collection">
        <ProtectedRoute requireAdmin>
          <AddCollection />
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;