import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// Define the login form schema
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Define the registration form schema
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Please confirm your password"),
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
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user, loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");
  const [resendEmailTo, setResendEmailTo] = useState<string | null>(null);

  // Redirect to home if already logged in
  if (user) {
    navigate("/");
    return null;
  }

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      userType: "visitor",
    },
  });

  // Handle login
  const onLogin = (values: LoginFormValues) => {
    loginMutation.mutate(values, {
      onSuccess: () => {
        toast({
          title: "Logged in successfully",
          description: "Welcome back!",
        });
        navigate("/");
      },
      onError: (error: any) => {
        if (error.response?.data?.needsVerification) {
          setResendEmailTo(error.response.data.email);
          toast({
            title: "Email verification required",
            description: "Please check your email to verify your account.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Login failed",
            description: error.message || "Invalid username or password",
            variant: "destructive",
          });
        }
      },
    });
  };

  // Handle registration
  const onRegister = (values: RegisterFormValues) => {
    // Remove confirmPassword before sending to API
    const { confirmPassword, ...dataToSend } = values;
    
    registerMutation.mutate(dataToSend, {
      onSuccess: () => {
        toast({
          title: "Registration successful",
          description: "Please check your email to verify your account.",
        });
        setActiveTab("login");
      },
      onError: (error: any) => {
        toast({
          title: "Registration failed",
          description: error.message || "Unable to create account",
          variant: "destructive",
        });
      },
    });
  };

  // Handle resend verification email
  const resendVerificationEmail = async () => {
    if (!resendEmailTo) return;
    
    try {
      const response = await fetch("/api/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: resendEmailTo }),
      });
      
      if (response.ok) {
        toast({
          title: "Verification email sent",
          description: "Please check your inbox and spam folder.",
        });
      } else {
        toast({
          title: "Failed to resend verification email",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to send verification email",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Portfolio App</h1>
            <p className="text-muted-foreground mt-2">
              Showcase your creative work
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Login</CardTitle>
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
                              <Input placeholder="username" {...field} />
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
                              <Input type="password" placeholder="********" {...field} />
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
                        ) : "Log In"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                {resendEmailTo && (
                  <CardFooter className="flex-col items-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      Your email needs verification. Didn't receive the email?
                    </p>
                    <Button variant="outline" onClick={resendVerificationEmail}>
                      Resend Verification Email
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Create an account</CardTitle>
                  <CardDescription>
                    Join our community and showcase your creative work
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
                              <Input placeholder="username" {...field} />
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
                              <Input type="email" placeholder="email@example.com" {...field} />
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
                              <Input type="password" placeholder="********" {...field} />
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
                              <Input type="password" placeholder="********" {...field} />
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
                                className="flex flex-col space-y-1"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="creator_collector" id="creator_collector" />
                                  <Label htmlFor="creator_collector" className="cursor-pointer">Creator/Collector</Label>
                                </div>
                                <p className="text-xs pl-6 text-muted-foreground">
                                  For artists, creators, and collectors who want to share and showcase work
                                </p>
                                
                                <div className="flex items-center space-x-2 mt-2">
                                  <RadioGroupItem value="visitor" id="visitor" />
                                  <Label htmlFor="visitor" className="cursor-pointer">Visitor</Label>
                                </div>
                                <p className="text-xs pl-6 text-muted-foreground">
                                  For those who want to browse and favorite items
                                </p>
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
                            Creating account...
                          </>
                        ) : "Register"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right side - Hero section */}
      <div className="hidden lg:flex flex-1 bg-primary items-center justify-center text-white">
        <div className="max-w-lg p-12">
          <h1 className="text-4xl font-bold mb-6">Showcase Your Creative Work</h1>
          <p className="text-lg mb-8">
            Connect with the creative community. Share your portfolio with the world and discover amazing work from other creators.
          </p>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center">
              <div className="h-6 w-6 rounded-full bg-white text-primary flex items-center justify-center mr-3">✓</div>
              Create your personalized portfolio
            </li>
            <li className="flex items-center">
              <div className="h-6 w-6 rounded-full bg-white text-primary flex items-center justify-center mr-3">✓</div>
              Link to your marketplace listings
            </li>
            <li className="flex items-center">
              <div className="h-6 w-6 rounded-full bg-white text-primary flex items-center justify-center mr-3">✓</div>
              Share custom links with collectors
            </li>
            <li className="flex items-center">
              <div className="h-6 w-6 rounded-full bg-white text-primary flex items-center justify-center mr-3">✓</div>
              Organize your work with categories and tags
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}