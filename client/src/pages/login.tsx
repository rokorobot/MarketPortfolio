import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Palette, User } from "lucide-react";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoginPage() {
  const { login, isLoading, user } = useAuth();
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("creator");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // If already logged in, redirect to home
  if (user) {
    setLocation("/");
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Pre-fill credentials based on tab selection
    if (value === "creator") {
      setFormData({
        username: "creator",
        password: "",
      });
    } else {
      setFormData({
        username: "visitor",
        password: "",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      toast({
        title: "Error",
        description: "Username and password are required",
        variant: "destructive",
      });
      return;
    }

    try {
      await login(formData);
    } catch (error) {
      // Error is handled in the auth hook
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6 bg-white rounded-xl overflow-hidden shadow-lg">
        <div className="p-6 md:p-8 flex flex-col justify-center">
          <h1 className="text-2xl font-bold mb-1">Portfolio Manager</h1>
          <p className="text-muted-foreground mb-6">
            Sign in to manage your creative portfolio
          </p>
          
          <Tabs defaultValue="creator" value={activeTab} onValueChange={handleTabChange} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="creator" className="flex items-center justify-center">
                <Palette className="w-4 h-4 mr-2" />
                Creator/Collector
              </TabsTrigger>
              <TabsTrigger value="visitor" className="flex items-center justify-center">
                <User className="w-4 h-4 mr-2" />
                Visitor
              </TabsTrigger>
            </TabsList>
            <TabsContent value="creator" className="pt-4">
              <p className="text-sm text-muted-foreground">
                Sign in as a Creator/Collector to manage the portfolio, add/edit items, and change site settings.
              </p>
            </TabsContent>
            <TabsContent value="visitor" className="pt-4">
              <p className="text-sm text-muted-foreground">
                Sign in as a Visitor to browse the portfolio with basic access (no admin features).
              </p>
            </TabsContent>
          </Tabs>
          
          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Enter your credentials to access the portfolio
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
        
        <div className="hidden md:block bg-gradient-to-br from-primary/80 to-primary p-8 text-white flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-4">Digital Portfolio Manager</h2>
          <p className="mb-4">
            Showcase your creative work across multiple marketplaces with our intuitive portfolio management system.
          </p>
          <ul className="space-y-2">
            <li className="flex items-center">
              <div className="rounded-full bg-white/20 p-1 mr-2">✓</div>
              Easy content management
            </li>
            <li className="flex items-center">
              <div className="rounded-full bg-white/20 p-1 mr-2">✓</div>
              AI-powered tag suggestions
            </li>
            <li className="flex items-center">
              <div className="rounded-full bg-white/20 p-1 mr-2">✓</div>
              Marketplace integration
            </li>
            <li className="flex items-center">
              <div className="rounded-full bg-white/20 p-1 mr-2">✓</div>
              Beautiful portfolio display
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}