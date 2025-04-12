import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Layout } from "@/components/layout";
import { Loader2, User, Edit, Save, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the type for author data
interface Author {
  name: string;
  count: number;
  profileImage: string | null;
}

// Form schema for updating author profile image
const authorProfileSchema = z.object({
  authorProfileImage: z.string().url("Please enter a valid URL").or(z.literal("")).optional(),
});

type AuthorProfileFormValues = z.infer<typeof authorProfileSchema>;

interface AuthorEditorProps {
  author: Author;
  onCancel: () => void;
  onSave: (name: string, profileImage: string | null) => void;
  isSaving: boolean;
}

function AuthorEditor({ author, onCancel, onSave, isSaving }: AuthorEditorProps) {
  const form = useForm<AuthorProfileFormValues>({
    resolver: zodResolver(authorProfileSchema),
    defaultValues: {
      authorProfileImage: author.profileImage || "",
    },
  });

  function onSubmit(data: AuthorProfileFormValues) {
    onSave(author.name, data.authorProfileImage || null);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="authorProfileImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Image URL</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="https://assets.objkt.media/profile/..." 
                  value={field.value || ''} 
                />
              </FormControl>
              <FormDescription>
                Direct URL to the author's profile image from OBJKT.com. Right-click on the profile image at OBJKT.com and select "Copy Image Address".
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default function ManageAuthorsPage() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const [editingAuthor, setEditingAuthor] = useState<string | null>(null);
  
  // Redirect non-admin users
  if (!isAdmin) {
    navigate("/");
    return null;
  }
  
  const { data: authors, isLoading, error } = useQuery<Author[]>({
    queryKey: ["/api/authors"],
  });

  const updateAuthorProfileMutation = useMutation({
    mutationFn: async ({ name, profileImage }: { name: string; profileImage: string | null }) => {
      const response = await apiRequest("PATCH", `/api/authors/${encodeURIComponent(name)}`, { profileImage });
      if (!response.ok) {
        throw new Error("Failed to update author profile");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "The author profile has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/authors"] });
      setEditingAuthor(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSaveProfileImage = (name: string, profileImage: string | null) => {
    updateAuthorProfileMutation.mutate({ name, profileImage });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <h2 className="text-xl font-bold mb-2">Failed to load authors</h2>
          <p className="text-muted-foreground">{(error as Error).message}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Authors</h1>
          <Button variant="outline" onClick={() => navigate("/authors")}>
            View Authors
          </Button>
        </div>
        
        {authors && authors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {authors.map((author) => (
              <Card key={author.name} className="h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {author.profileImage ? (
                        <img 
                          src={author.profileImage} 
                          alt={`${author.name} profile`} 
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-10 w-10" />
                        </div>
                      )}
                      <div>
                        <CardTitle>{author.name}</CardTitle>
                        <Badge variant="outline" className="mt-1">
                          {author.count} {author.count === 1 ? "item" : "items"}
                        </Badge>
                      </div>
                    </div>
                    
                    {editingAuthor !== author.name && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setEditingAuthor(author.name)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="ml-2">Edit</span>
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {editingAuthor === author.name ? (
                    <AuthorEditor 
                      author={author}
                      onCancel={() => setEditingAuthor(null)}
                      onSave={handleSaveProfileImage}
                      isSaving={updateAuthorProfileMutation.isPending}
                    />
                  ) : (
                    <div className="text-sm text-muted-foreground mt-2">
                      {author.profileImage ? (
                        <p>Profile image is set.</p>
                      ) : (
                        <p>No profile image set. Click Edit to add one.</p>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => navigate(`/items/author/${encodeURIComponent(author.name)}`)}
                  >
                    View Items
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No authors found.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}