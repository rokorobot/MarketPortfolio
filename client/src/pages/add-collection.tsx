import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { getProxiedImageUrl } from "@/lib/utils";
import { insertCategorySchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Layout } from "@/components/layout";
import { Loader2, Upload, Image as ImageIcon, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// Extend the schema with additional validation
const formSchema = insertCategorySchema
  .extend({
    name: z.string().min(3, "Name must be at least 3 characters").max(50, "Name must be less than 50 characters"),
    description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description must be less than 500 characters").nullable(),
    imageUrl: z.string().nullable().optional(),
  });

export default function AddCollection() {
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const isContentManager = Boolean(user && (user.role === "admin" || user.role === "superadmin" || user.role === "creator"));
  const [, navigate] = useLocation();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("url");
  const [uploadedImagePath, setUploadedImagePath] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
    },
  });
  
  const addCategoryMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      // If we have an uploaded image path, use that instead of the URL
      if (activeTab === "upload" && uploadedImagePath) {
        data.imageUrl = uploadedImagePath;
      }
      
      const response = await apiRequest("POST", "/api/categories", data);
      return await response.json();
    },
    onSuccess: () => {
      // Invalidate all categories queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      queryClient.invalidateQueries({ queryKey: ['/api/category-options'] });
      
      toast({
        title: "Success",
        description: "Collection has been created successfully",
      });
      
      // Navigate back to home page
      navigate("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to create collection: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const uploadImageMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/collections/upload-image', {
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
        title: "Error",
        description: `Failed to upload image: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const handlePreviewImage = (url: string) => {
    if (url) {
      setPreviewImage(url);
    } else {
      setPreviewImage(null);
    }
  };
  
  // Watch for imageUrl changes to update preview when URL tab is active
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'imageUrl' && activeTab === "url") {
        handlePreviewImage(value.imageUrl as string);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, activeTab]);
  
  // Handle file selection for upload
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
  
  const clearUploadedImage = () => {
    setPreviewImage(null);
    setUploadedImagePath(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  async function onSubmit(data: z.infer<typeof formSchema>) {
    await addCategoryMutation.mutate(data);
  }
  
  // Show loading while auth state is being determined
  if (authLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }
  
  // Redirect if not logged in or not content manager
  if (!user || !isContentManager) {
    return <Redirect to="/" />;
  }
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Add New Collection</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collection Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter collection name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This will be displayed as a category option when adding new items.
                  </FormDescription>
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
                    <Textarea
                      placeholder="Enter a description of this collection"
                      className="min-h-[120px]"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide details about what this collection includes.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Tabs defaultValue="url" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="mb-2">
                <TabsTrigger value="url">Image URL</TabsTrigger>
                <TabsTrigger value="upload">Upload Image</TabsTrigger>
              </TabsList>
              
              <TabsContent value="url">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Collection Image URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter image URL" 
                          {...field} 
                          value={field.value || ""}
                          disabled={activeTab !== "url"}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide a URL to an image that represents this collection.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="upload">
                <div className="space-y-4">
                  <FormItem>
                    <FormLabel>Upload Collection Image</FormLabel>
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
                      Upload an image file (JPEG, PNG, GIF) to represent this collection.
                    </FormDescription>
                  </FormItem>
                </div>
              </TabsContent>
              
              {previewImage && (
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
                  <Card className="overflow-hidden w-48 h-48 flex items-center justify-center">
                    <img 
                      src={getProxiedImageUrl(previewImage)} 
                      alt="Collection preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        setPreviewImage(null);
                        console.log('Add Collection preview image failed to load:', previewImage);
                      }}
                      crossOrigin="anonymous"
                    />
                  </Card>
                </div>
              )}
            </Tabs>
            
            <div className="flex items-center gap-4">
              <Button
                type="submit"
                disabled={addCategoryMutation.isPending}
                className="px-8"
              >
                {addCategoryMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Collection
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Layout>
  );
}