import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ThemeProvider } from "@/components/theme-provider";
import { ShowcaseProvider } from "@/hooks/use-showcase";
import Home from "@/pages/home";
import AuthPage from "@/pages/auth-page";
import Item from "@/pages/item";
import NotFound from "@/pages/not-found";
// Adding other imports one by one to identify the problematic component

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/item/:id" component={Item} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark-green" storageKey="portfolio-theme">
        <AuthProvider>
          <ShowcaseProvider>
            <Router />
            <Toaster />
          </ShowcaseProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;