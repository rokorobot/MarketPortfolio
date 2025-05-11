import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";

// Schema for login form
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Schema for registration form
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  displayName: z.string().optional(),
  userType: z.enum(["creator_collector", "visitor"], {
    required_error: "Please select an account type",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [location, navigate] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");
  const [resendEmailVisible, setResendEmailVisible] = useState(false);
  const [resendEmail, setResendEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null);
  const { toast } = useToast();

  // Check for verification token in URL
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const verifyToken = queryParams.get('verify');
    
    if (verifyToken) {
      setVerifying(true);
      
      // Clear the token from URL to prevent multiple verification attempts
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Call the verification API
      fetch(`/api/verify-email?token=${verifyToken}`)
        .then(response => response.json())
        .then(data => {
          setVerifying(false);
          setVerificationMessage(data.message);
          toast({
            title: "Email verification",
            description: data.message,
            variant: data.message.includes("successfully") ? "default" : "destructive"
          });
        })
        .catch(error => {
          setVerifying(false);
          setVerificationMessage("An error occurred during verification. Please try again.");
          toast({
            title: "Verification error",
            description: "An error occurred during verification. Please try again.",
            variant: "destructive"
          });
        });
    }
  }, [toast]);

  // Setup forms
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      displayName: "",
      userType: "visitor",
    },
  });
  
  // Redirect to home if already logged in
  // This must come after all hook calls
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const onLogin = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  const onRegister = (values: RegisterFormValues) => {
    // Remove confirmPassword as it's not needed in the API call
    const { confirmPassword, ...registerData } = values;
    registerMutation.mutate(registerData, {
      onSuccess: () => {
        // Show verification message and reset form
        setActiveTab("login");
        registerForm.reset();
      },
    });
  };

  const handleResendEmail = async () => {
    if (!resendEmail) return;

    setIsResending(true);
    try {
      const response = await fetch("/api/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: resendEmail }),
      });

      const data = await response.json();
      setResendMessage(data.message);
    } catch (error) {
      setResendMessage("An error occurred. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="container py-10 max-w-screen-xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Auth Forms */}
        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Login to your account</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input {...field} autoComplete="username" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} autoComplete="current-password" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Logging in...
                          </>
                        ) : (
                          "Login"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                  <Button 
                    variant="link" 
                    onClick={() => setResendEmailVisible(!resendEmailVisible)}
                    className="px-0 text-sm"
                  >
                    Need to verify your email?
                  </Button>
                  
                  {resendEmailVisible && (
                    <div className="w-full space-y-2">
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={resendEmail}
                        onChange={(e) => setResendEmail(e.target.value)}
                      />
                      <Button 
                        onClick={handleResendEmail}
                        disabled={isResending || !resendEmail}
                        className="w-full"
                        variant="outline"
                        size="sm"
                      >
                        {isResending ? (
                          <>
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          "Resend Verification Email"
                        )}
                      </Button>
                      {resendMessage && (
                        <p className="text-sm text-muted-foreground mt-2">{resendMessage}</p>
                      )}
                    </div>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Create an account</CardTitle>
                  <CardDescription>
                    Fill in your details to create a new account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input {...field} autoComplete="username" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} autoComplete="email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="displayName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Display Name (Optional)</FormLabel>
                            <FormControl>
                              <Input {...field} autoComplete="name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} autoComplete="new-password" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} autoComplete="new-password" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="userType"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Account Type</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid grid-cols-1 gap-4"
                              >
                                <div className="flex items-center space-x-2 border rounded-md p-3">
                                  <RadioGroupItem value="creator_collector" id="creator" />
                                  <label htmlFor="creator" className="text-sm font-medium leading-none cursor-pointer flex-1">
                                    <div className="font-medium">Creator/Collector</div>
                                    <p className="text-sm text-muted-foreground">
                                      For artists, collectors, and content creators
                                    </p>
                                  </label>
                                </div>
                                <div className="flex items-center space-x-2 border rounded-md p-3">
                                  <RadioGroupItem value="visitor" id="visitor" />
                                  <label htmlFor="visitor" className="text-sm font-medium leading-none cursor-pointer flex-1">
                                    <div className="font-medium">Visitor</div>
                                    <p className="text-sm text-muted-foreground">
                                      For browsing and viewing content only
                                    </p>
                                  </label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Account...
                          </>
                        ) : (
                          "Register"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Hero Section */}
        <div className="hidden md:block">
          <div className="bg-muted/20 border rounded-xl p-8 h-full">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Digital Portfolio Platform
            </h2>
            <p className="text-lg mb-6">
              A professional platform to showcase your creative works and connect with collectors around the world.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="text-primary"
                  >
                    <circle cx="12" cy="12" r="10"/>
                    <path d="m9 12 2 2 4-4"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Showcase your work</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload and organize your portfolio items with detailed information
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="text-primary"
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                    <path d="m2 12 5.25 5"/>
                    <path d="M2 12h7"/>
                    <path d="m12 7 3.25 3"/>
                    <path d="M12 7v5"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Connect with marketplaces</h3>
                  <p className="text-sm text-muted-foreground">
                    Link directly to NFT and digital art marketplaces
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="text-primary"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2"/>
                    <line x1="2" x2="22" y1="10" y2="10"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Secure creator profiles</h3>
                  <p className="text-sm text-muted-foreground">
                    Verified accounts with wallet integration for creators and collectors
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}