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
import { ProtectedRoute } from "@/components/protected-route";
import AddItem from "@/pages/add-item";
import AddCollection from "@/pages/add-collection";
import ManageCategories from "@/pages/manage-categories";
import SiteSettings from "@/pages/site-settings";
import ManageAuthors from "@/pages/manage-authors";
import ImportNFTs from "@/pages/import-nfts";
import AdminDashboard from "@/pages/admin-dashboard";
import CreatorDashboard from "@/pages/creator-dashboard";
// All components restored

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
      <Route path="/manage-categories">
        <ProtectedRoute requireAdmin>
          <ManageCategories />
        </ProtectedRoute>
      </Route>
      <Route path="/site-settings">
        <ProtectedRoute requireAdmin>
          <SiteSettings />
        </ProtectedRoute>
      </Route>
      <Route path="/manage-authors">
        <ProtectedRoute requireAdmin>
          <ManageAuthors />
        </ProtectedRoute>
      </Route>
      <Route path="/import-nfts">
        <ProtectedRoute>
          <ImportNFTs />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/dashboard">
        <ProtectedRoute requireAdmin>
          <AdminDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/creator/dashboard">
        <ProtectedRoute>
          <CreatorDashboard />
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <div style={{ padding: '20px', fontSize: '24px', background: 'white', minHeight: '100vh' }}>
      <h1 style={{ color: 'black' }}>Simple Test App</h1>
      <p style={{ color: 'black' }}>Testing if React renders at all...</p>
    </div>
  );
}

export default App;