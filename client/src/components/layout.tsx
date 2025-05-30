import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Plus, UserCircle, LogOut, FolderPlus, Settings, Heart, Grid3X3, Presentation, Clock, User, Download, BarChart3, Eye, Users } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Showcase interval setting component for dropdown menu
const ShowcaseIntervalSetting = () => {
  const { toast } = useToast();
  const [localInterval, setLocalInterval] = useState<string>("8");
  
  // Fetch the current showcase interval from site settings
  const { data: settings } = useQuery<Record<string, string | null>>({
    queryKey: ['/api/site-settings'],
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
  
  // Update local state when settings are loaded
  useEffect(() => {
    if (settings?.showcase_interval) {
      // Convert from milliseconds to seconds for display
      const seconds = parseInt(settings.showcase_interval) / 1000;
      setLocalInterval(seconds.toString());
    }
  }, [settings]);
  
  // Mutation to update the showcase interval setting
  const updateIntervalMutation = useMutation({
    mutationFn: async (newInterval: string) => {
      console.log('Updating interval to:', newInterval, 'seconds');
      const milliseconds = (parseInt(newInterval) * 1000).toString();
      console.log('Sending API request with value:', milliseconds, 'ms');
      
      try {
        const response = await apiRequest('POST', '/api/showcase-interval', {
          value: milliseconds, // Convert to milliseconds for storage
        });
        
        console.log('API response status:', response.status);
        const data = await response.json();
        console.log('API response data:', data);
        return data;
      } catch (error) {
        console.error('API request failed:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Mutation succeeded with data:', data);
      queryClient.invalidateQueries({ queryKey: ['/api/site-settings'] });
      toast({
        title: "Showcase interval updated",
        description: `Slides will now change every ${localInterval} seconds`,
      });
      
      // Dispatch an event to notify the showcase component
      const eventData = { interval: parseInt(localInterval) * 1000 };
      console.log('Dispatching showcase-interval-changed event with data:', eventData);
      document.dispatchEvent(new CustomEvent('showcase-interval-changed', {
        detail: eventData
      }));
    },
    onError: (error: Error) => {
      console.error('Mutation failed:', error);
      toast({
        title: "Failed to update showcase interval",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const handleIntervalChange = (value: string) => {
    setLocalInterval(value);
    updateIntervalMutation.mutate(value);
  };
  
  return (
    <div className="flex items-center px-2 py-1.5">
      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
      <div className="flex-1">
        <div className="text-sm mb-1">Showcase Speed</div>
        <Select value={localInterval} onValueChange={handleIntervalChange}>
          <SelectTrigger className="h-8 w-full">
            <SelectValue placeholder="8 seconds" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">3 seconds</SelectItem>
            <SelectItem value="5">5 seconds</SelectItem>
            <SelectItem value="8">8 seconds</SelectItem>
            <SelectItem value="10">10 seconds</SelectItem>
            <SelectItem value="15">15 seconds</SelectItem>
            <SelectItem value="20">20 seconds</SelectItem>
            <SelectItem value="30">30 seconds</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

// View Toggle component for switching between creator and collector views
const ViewToggle = ({ user }: { user: any }) => {
  const [isCreatorView, setIsCreatorView] = useState(false);
  
  const handleToggle = (checked: boolean) => {
    setIsCreatorView(checked);
    // Dispatch custom event to notify components about view change
    document.dispatchEvent(new CustomEvent('view-toggle-changed', {
      detail: { isCreatorView: checked }
    }));
  };
  
  return (
    <div className="flex items-center space-x-3 px-3 py-1.5 border rounded-md bg-background">
      <span className={`text-sm font-medium ${!isCreatorView ? 'text-primary' : 'text-muted-foreground'}`}>
        Collector View
      </span>
      <Switch
        id="view-toggle"
        checked={isCreatorView}
        onCheckedChange={handleToggle}
      />
      <span className={`text-sm font-medium ${isCreatorView ? 'text-primary' : 'text-muted-foreground'}`}>
        Creator View
      </span>
    </div>
  );
};

// Showcase Button component that triggers the slideshow of portfolio items
const ShowcaseButton = () => {
  // We don't need useShowcase here, we'll just dispatch a custom event
  // that will be handled by the PortfolioGrid component
  const [location] = useLocation();
  
  // Only use inactive styling on the portfolio/home page (/)
  const isPortfolioPage = location === "/";
  
  return (
    <Button 
      variant="outline"
      size="sm" 
      className={`gap-2 ${!isPortfolioPage ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}`}
      onClick={() => {
        // Dispatch custom event that will be handled by PortfolioGrid
        document.dispatchEvent(new CustomEvent('start-showcase'));
      }}
    >
      <Presentation className="h-4 w-4" />
      Showcase
    </Button>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation();
  const { user, isAdmin, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div 
              className={`text-2xl font-bold cursor-pointer ${
                location === "/" 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => navigate("/")}
            >
              Portfolio
            </div>
            
            <div
              className={`text-2xl font-bold cursor-pointer ${
                location === "/favorites" 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => navigate(user ? "/favorites" : "/auth")}
            >
              Favorites
            </div>
            
            <div
              className={`text-2xl font-bold cursor-pointer ${
                location.startsWith("/collections") 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => navigate("/collections")}
            >
              Collections
            </div>
            
            <div
              className={`text-2xl font-bold cursor-pointer ${
                location.startsWith("/authors") 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => navigate("/authors")}
            >
              Authors
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            {isAdmin && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={() => navigate("/add-item")} 
                      size="sm" 
                      className="px-2"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add Item</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={() => navigate("/add-collection")} 
                      variant="outline" 
                      size="sm" 
                      className="px-2"
                    >
                      <FolderPlus className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add Collection</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            {/* Import NFTs button - available only to creators, admin, and superadmin */}
            {user && (user.role === 'creator' || user.role === 'admin' || user.role === 'superadmin') && !location.startsWith("/import-nfts") && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/import-nfts")}
                className="gap-2"
              >
                <Download className="mr-2 h-4 w-4" />
                Import NFTs
              </Button>
            )}
            
            {/* View Toggle - available to creators and collectors */}
            {user && (user.role === 'creator' || user.role === 'collector') && (
              <ViewToggle user={user} />
            )}
            
            <ShowcaseButton />
            
            {/* Standalone dropdown for showcase settings - available to all users */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="px-2">
                  <Clock className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Showcase Settings</DropdownMenuLabel>
                <ShowcaseIntervalSetting />
              </DropdownMenuContent>
            </DropdownMenu>
            
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
                  <DropdownMenuItem onClick={() => navigate("/collections")}>
                    <Grid3X3 className="h-4 w-4 mr-2" />
                    Collections
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/authors")}>
                    <User className="h-4 w-4 mr-2" />
                    Authors
                  </DropdownMenuItem>
                  
                  {user && (user.role === 'admin' || user.role === 'superadmin' || user.role === 'creator') && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate("/creator/dashboard")}>
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Creator Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/manage-categories")}>
                        <Settings className="h-4 w-4 mr-2" />
                        Manage Collections
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  {user && user.role === 'superadmin' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate("/admin/dashboard")}>
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Admin Dashboard
                      </DropdownMenuItem>
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
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => navigate("/auth")}>
                  <UserCircle className="h-4 w-4 mr-2" />
                  Sign Up / Login
                </Button>
              </div>
            )}
          </div>
        </nav>
      </header>
      <main className="container mx-auto px-4 py-8 flex-grow">{children}</main>
      <Footer />
    </div>
  );
}