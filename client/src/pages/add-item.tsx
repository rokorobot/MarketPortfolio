import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { insertPortfolioItemSchema, type InsertPortfolioItem, type CategoryEnum } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Image, Upload, Loader2, TagIcon } from "lucide-react";
import { TagInput } from "@/components/tag-input";

export default function AddItem() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const form = useForm<InsertPortfolioItem>({
    resolver: zodResolver(insertPortfolioItemSchema),
    defaultValues: {
      title: "",
      description: "",
      author: "",
      authorUrl: "",
      authorProfileImage: "",
      imageUrl: "",
      category: "Digital Art",
      marketplaceUrl1: "",
      marketplaceUrl2: "",
      marketplaceName1: "",
      marketplaceName2: "",
    },
  });

  const { data: categories } = useQuery<string[]>({
    queryKey: ["/api/category-options"],
    // Default to empty array if no data
    initialData: [],
  });

  const createItemMutation = useMutation({
    mutationFn: async (data: InsertPortfolioItem) => {
      const res = await apiRequest("POST", "/api/items", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/items"] });
      toast({
        title: "Success",
        description: "Item added successfully",
      });
      navigate("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, GIF, or WebP image.",
        variant: "destructive",
      });
      return;
    }

    // Set uploading state
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      setUploadedImage(data.imagePath);
      
      // Update the form value
      form.setValue("imageUrl", data.imagePath);
      
      toast({
        title: "Upload successful",
        description: "Your image has been uploaded.",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };
  
  const generateTagSuggestions = async () => {
    // Check if there's enough content to generate meaningful tags
    const title = form.getValues("title");
    const description = form.getValues("description");
    const imagePath = uploadedImage;
    
    if (!title && !description && !imagePath) {
      toast({
        title: "Missing content",
        description: "Please add a title, description, or upload an image first.",
        variant: "destructive",
      });
      return;
    }
    
    setLoadingSuggestions(true);
    
    try {
      const response = await fetch("/api/suggest-tags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          imagePath,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate tag suggestions");
      }
      
      const data = await response.json();
      
      if (Array.isArray(data.tags) && data.tags.length > 0) {
        setTagSuggestions(data.tags);
        toast({
          title: "Suggestions generated",
          description: "Tag suggestions have been generated based on your content.",
        });
      } else {
        toast({
          title: "No suggestions found",
          description: "Couldn't generate tag suggestions. Try adding more details or a different image.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error generating suggestions",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  async function onSubmit(data: InsertPortfolioItem) {
    // Include tags in the submission
    const itemWithTags = {
      ...data,
      tags: tags,
    };
    createItemMutation.mutate(itemWithTags);
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Add New Portfolio Item</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Creator or artist name" value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="authorUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author URL</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="url" 
                      placeholder="https://objkt.com/profile/..."
                      value={field.value || ''} 
                    />
                  </FormControl>
                  <FormDescription>
                    Link to the artist's profile page or website.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="authorProfileImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author Profile Image URL</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="url" 
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

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <div className="flex flex-col space-y-3">
                    {uploadedImage ? (
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-border">
                        <img 
                          src={uploadedImage} 
                          alt="Uploaded preview" 
                          className="object-cover w-full h-full"
                        />
                        <Button
                          type="button" 
                          variant="outline" 
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setUploadedImage(null);
                            form.setValue("imageUrl", "");
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                          }}
                        >
                          Change Image
                        </Button>
                      </div>
                    ) : (
                      <div 
                        className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={triggerFileInput}
                      >
                        {uploading ? (
                          <div className="flex flex-col items-center justify-center">
                            <Loader2 className="h-10 w-10 text-primary animate-spin mb-2" />
                            <p className="text-sm text-muted-foreground">Uploading...</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center">
                            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                            <p className="font-medium">Click to upload an image</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              JPG, PNG, GIF or WebP (max. 10MB)
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      className="hidden" 
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handleFileUpload}
                    />
                    <input type="hidden" {...field} />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <TagIcon className="h-4 w-4" />
                Tags
              </FormLabel>
              <TagInput
                value={tags}
                onChange={setTags}
                suggestions={tagSuggestions}
                onRequestSuggestions={generateTagSuggestions}
                isLoading={loadingSuggestions}
                disabled={createItemMutation.isPending}
              />
              <FormDescription>
                Add tags to make your portfolio item more discoverable. Tags help categorize and find your work.
              </FormDescription>
            </FormItem>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="marketplaceName1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Marketplace Name</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="e.g., OpenSea" 
                          value={field.value || ''} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="marketplaceUrl1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Marketplace URL</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="url" 
                          placeholder="https://..." 
                          value={field.value || ''} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="marketplaceName2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secondary Marketplace Name</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="e.g., Foundation" 
                          value={field.value || ''} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="marketplaceUrl2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secondary Marketplace URL</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="url" 
                          placeholder="https://..." 
                          value={field.value || ''} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={createItemMutation.isPending || uploading}
            >
              {createItemMutation.isPending ? "Adding..." : "Add Item"}
            </Button>
          </form>
        </Form>
      </div>
    </Layout>
  );
}