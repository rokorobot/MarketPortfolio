import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Plus, UserCircle, LogOut, FolderPlus, Settings, Heart } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { Footer } from "@/components/footer";

export function Layout({ children }: { children: React.ReactNode }) {
  const [, navigate] = useLocation();
  const { user, isAdmin, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div 
            className="text-2xl font-bold text-primary hover:text-primary/90 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Portfolio
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            {isAdmin && (
              <>
                <Button onClick={() => navigate("/add-item")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
                
                <Button onClick={() => navigate("/add-collection")} variant="outline">
                  <FolderPlus className="mr-2 h-4 w-4" />
                  Add Collection
                </Button>
              </>
            )}
            
            {user && (
              <Button 
                onClick={() => navigate("/favorites")} 
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Heart className="h-4 w-4" />
                Favorites
              </Button>
            )}
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <UserCircle className="h-4 w-4" />
                    {user.username}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuItem disabled>
                    Role: {user.role}
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/favorites")}>
                    <Heart className="h-4 w-4 mr-2" />
                    My Favorites
                  </DropdownMenuItem>
                  
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate("/manage-categories")}>
                        <Settings className="h-4 w-4 mr-2" />
                        Manage Categories
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/site-settings")}>
                        <Settings className="h-4 w-4 mr-2" />
                        Site Settings
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" size="sm" onClick={() => navigate("/login")}>
                Sign In
              </Button>
            )}
          </div>
        </nav>
      </header>
      <main className="container mx-auto px-4 py-8 flex-grow">{children}</main>
      <Footer />
    </div>
  );
}