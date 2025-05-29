import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Layout } from "@/components/layout";
import { Loader2, User, Edit, Save, X, Upload, Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { getProxiedImageUrl } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the type for author data
interface Author {
  name: string;
  count: number;
  profileImage: string | null;
}

// Form schema for updating author profile image and name
const authorProfileSchema = z.object({
  authorProfileImage: z.string().refine((val) => {
    if (!val || val === "") return true;
    // Allow URLs (http/https) or local paths (/uploads/...)
    return val.startsWith("http://") || val.startsWith("https://") || val.startsWith("/uploads/");
  }, "Please enter a valid URL or upload an image").optional(),
  authorName: z.string().min(2, "Name must be at least 2 characters").optional(),
});

type AuthorProfileFormValues = z.infer<typeof authorProfileSchema>;

interface AuthorEditorProps {
  author: Author;
  onCancel: () => void;
  onSave: (originalName: string, newName: string, profileImage: string | null) => void;
  isSaving: boolean;
}

function AuthorEditor({ author, onCancel, onSave, isSaving }: AuthorEditorProps) {
  const [activeTab, setActiveTab] = useState<string>("url");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadedImagePath, setUploadedImagePath] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const form = useForm<AuthorProfileFormValues>({
    resolver: zodResolver(authorProfileSchema),
    defaultValues: {
      authorProfileImage: author.profileImage || "",
      authorName: author.name || "",
    },
  });

  // Image upload mutation
  const uploadImageMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/authors/upload-image', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload image');
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      // Set the uploaded image path to be used in the form submission
      setUploadedImagePath(data.imagePath);
      setPreviewImage(data.imagePath);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // OBJKT profile fetch mutation
  const fetchObjktProfileMutation = useMutation({
    mutationFn: async (authorName: string) => {
      const response = await fetch(`/api/authors/${encodeURIComponent(authorName)}/fetch-objkt-profile`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch profile from OBJKT');
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      // Update form with the fetched profile image
      form.setValue("authorProfileImage", data.profileImage);
      setPreviewImage(data.profileImage);
      
      toast({
        title: "Success",
        description: data.message,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to upload image: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Handle file selection for image upload
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }
    
    // Display a preview of the selected image
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPreviewImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
    
    // Upload the file
    const formData = new FormData();
    formData.append('image', file);
    
    setIsUploading(true);
    try {
      await uploadImageMutation.mutateAsync(formData);
    } finally {
      setIsUploading(false);
    }
  };
  
  // Clear the uploaded image
  const clearUploadedImage = () => {
    setPreviewImage(null);
    setUploadedImagePath(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  function onSubmit(data: AuthorProfileFormValues) {
    // Determine the name to use (original or new)
    const newName = data.authorName && data.authorName !== author.name 
      ? data.authorName 
      : author.name;
    
    // Determine the profile image to use
    const newProfileImage = activeTab === "upload" && uploadedImagePath
      ? uploadedImagePath
      : data.authorProfileImage || null;
    
    // Save the changes - pass the original author name too
    onSave(author.name, newName, newProfileImage);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4 pb-4">
          {/* Author Name Field */}
          <FormField
            control={form.control}
            name="authorName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author Name</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Author Name" 
                  />
                </FormControl>
                <FormDescription>
                  Edit the author name, especially useful for converting Tezos addresses to readable names.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Tabs defaultValue="url" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="mb-2">
              <TabsTrigger value="url">
                <ImageIcon className="h-4 w-4 mr-2" />
                Image URL
              </TabsTrigger>
              <TabsTrigger value="upload">
                <Upload className="h-4 w-4 mr-2" />
                Upload Image
              </TabsTrigger>
              {author.name.startsWith('tz1') && (
                <TabsTrigger value="objkt">
                  <User className="h-4 w-4 mr-2" />
                  Fetch from OBJKT
                </TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="url">
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
                        disabled={activeTab !== "url"}
                      />
                    </FormControl>
                    <FormDescription>
                      Direct URL to the author's profile image from OBJKT.com or any other source. Right-click on the profile image and select "Copy Image Address".
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
            
            <TabsContent value="upload">
              <div className="space-y-4">
                <FormItem>
                  <FormLabel>Upload Profile Image</FormLabel>
                  <FormControl>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        disabled={isUploading}
                        className="cursor-pointer"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload an image file (JPEG, PNG, GIF) for the author's profile.
                  </FormDescription>
                </FormItem>
              </div>
            </TabsContent>
            
            {author.name.startsWith('tz1') && (
              <TabsContent value="objkt">
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      Fetch the official profile image for this Tezos address from OBJKT.com
                    </p>
                    <Button
                      type="button"
                      onClick={() => fetchObjktProfileMutation.mutate(author.name)}
                      disabled={fetchObjktProfileMutation.isPending}
                      className="w-full"
                    >
                      {fetchObjktProfileMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Fetching from OBJKT...
                        </>
                      ) : (
                        <>
                          <User className="mr-2 h-4 w-4" />
                          Fetch Profile from OBJKT
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>
          
          {/* Image Preview Section */}
          {(form.watch("authorProfileImage") || previewImage) && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Image Preview:</p>
                {activeTab === "upload" && uploadedImagePath && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearUploadedImage}
                    type="button"
                    className="h-8"
                  >
                    <X className="h-4 w-4 mr-1" /> Clear
                  </Button>
                )}
              </div>
              <Card className="overflow-hidden w-36 h-36 flex items-center justify-center">
                <img 
                  src={getProxiedImageUrl(previewImage || form.watch("authorProfileImage") || "")} 
                  alt="Author profile preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.log('Author profile preview image failed to load:', previewImage || form.watch("authorProfileImage"));
                    e.currentTarget.src = "https://placehold.co/150x150/gray/white?text=Invalid+Image";
                  }}
                  crossOrigin="anonymous"
                />
              </Card>
            </div>
          )}
        </div>
        
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
            disabled={isSaving || isUploading}
          >
            {isSaving || isUploading ? (
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
    mutationFn: async ({ 
      originalName, 
      newName, 
      profileImage 
    }: { 
      originalName: string;
      newName: string; 
      profileImage: string | null 
    }) => {
      // Determine if we're changing the name
      const isNameChanged = originalName !== newName;
      
      // Send the update with appropriate parameters
      const response = await apiRequest(
        "PATCH", 
        `/api/authors/${encodeURIComponent(originalName)}`, 
        { 
          profileImage,
          // Only include newName if it's actually changed
          ...(isNameChanged ? { newName } : {})
        }
      );
      
      if (!response.ok) {
        throw new Error("Failed to update author profile");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Profile updated",
        description: data.newName 
          ? "The author name and profile have been updated successfully." 
          : "The author profile has been updated successfully.",
      });
      
      // Invalidate both authors list and items by this author
      queryClient.invalidateQueries({ queryKey: ["/api/authors"] });
      
      // Close the editor
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

  // Migration mutation to update truncated Tezos addresses
  const migrateAddressesMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/authors/migrate-addresses");
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Migration Complete",
        description: "All Tezos addresses have been updated with full addresses and profile images.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/authors"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Migration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle author profile updates - called from the AuthorEditor component
  const handleSaveAuthorProfile = (originalName: string, newName: string, profileImage: string | null) => {
    updateAuthorProfileMutation.mutate({ 
      originalName,
      newName, 
      profileImage 
    });
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
          <div className="flex gap-2">
            <Button 
              variant="secondary"
              onClick={() => migrateAddressesMutation.mutate()}
              disabled={migrateAddressesMutation.isPending}
            >
              {migrateAddressesMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Migrating...
                </>
              ) : (
                "Update Tezos Addresses"
              )}
            </Button>
            <Button variant="outline" onClick={() => navigate("/authors")}>
              View Authors
            </Button>
          </div>
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
                      onSave={handleSaveAuthorProfile}
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