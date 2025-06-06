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
import SharePage from "@/pages/share";
import AboutPage from "@/pages/about";
import ContactPage from "@/pages/contact";
import Collections from "@/pages/collections";
import Authors from "@/pages/authors";
import AuthorItems from "@/pages/author-items";
import Favorites from "@/pages/favorites";
import CreatorDashboard from "@/pages/creator-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import SimpleImportPage from "@/pages/simple-import";
import ManageCategories from "@/pages/manage-categories";
import AddItem from "@/pages/add-item";
import AddCollection from "@/pages/add-collection";
import { ProtectedRoute } from "@/components/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/item/:id" component={Item} />
      <Route path="/share/:shareCode" component={SharePage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/collections/:category?" component={Collections} />
      <Route path="/authors" component={Authors} />
      <Route path="/items/author/:authorName" component={AuthorItems} />
      <Route path="/favorites">
        <ProtectedRoute>
          <Favorites />
        </ProtectedRoute>
      </Route>
      <Route path="/creator/dashboard">
        <ProtectedRoute>
          <CreatorDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/dashboard">
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/import-nfts">
        <ProtectedRoute>
          <SimpleImportPage />
        </ProtectedRoute>
      </Route>
      <Route path="/manage-categories">
        <ProtectedRoute>
          <ManageCategories />
        </ProtectedRoute>
      </Route>
      <Route path="/add-item">
        <ProtectedRoute>
          <AddItem />
        </ProtectedRoute>
      </Route>
      <Route path="/add-collection">
        <ProtectedRoute>
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