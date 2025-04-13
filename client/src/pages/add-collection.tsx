import React, { useState, useEffect } from "react";
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
import { Loader2, Image as ImageIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

// Extend the schema with additional validation
const formSchema = insertCategorySchema
  .extend({
    name: z.string().min(3, "Name must be at least 3 characters").max(50, "Name must be less than 50 characters"),
    description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description must be less than 500 characters").nullable(),
    imageUrl: z.string().nullable().optional(),
  });

export default function AddCollection() {
  const { toast } = useToast();
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
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
  
  const handlePreviewImage = (url: string) => {
    if (url) {
      setPreviewImage(url);
    } else {
      setPreviewImage(null);
    }
  };
  
  // Watch for imageUrl changes to update preview
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'imageUrl') {
        handlePreviewImage(value.imageUrl as string);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);
  
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
  
  // Redirect if not logged in or not admin
  if (!user || !isAdmin) {
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
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a URL to an image that represents this collection.
                  </FormDescription>
                  {previewImage && (
                    <div className="mt-2">
                      <p className="text-sm mb-2">Image Preview:</p>
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
                  <FormMessage />
                </FormItem>
              )}
            />
            
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