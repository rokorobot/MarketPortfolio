import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type UserProfile = {
  id: string;
  username: string;
  email: string | null;
  role: string;
  displayName?: string | null;
  profileImageUrl?: string | null;
  bio?: string | null;
  website?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  tezosWalletAddress?: string | null;
  ethereumWalletAddress?: string | null;
}

type AuthContextType = {
  user: UserProfile | null;
  isLoading: boolean;
  error: Error | null;
  logoutMutation: UseMutationResult<void, Error, void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<UserProfile | undefined, Error>({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      // Redirect to Replit Auth logout
      window.location.href = "/api/logout";
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/user"], null);
      queryClient.invalidateQueries({queryKey: ["/api/auth/user"]});
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        logoutMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  // Add convenience methods and derived properties
  return {
    ...context,
    isAuthenticated: !!context.user,
    isAdmin: context.user?.role === 'admin',
    login: () => {
      // Redirect to Replit Auth login
      window.location.href = "/api/login";
    },
    logout: () => {
      // Redirect to Replit Auth logout
      window.location.href = "/api/logout";
    }
  };
}