import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Tag, Trash2, Share2, Twitter, Edit, Save, X, Loader2 } from "lucide-react";
import { PORTFOLIO_CATEGORIES, type PortfolioItem } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShareLinkGenerator } from "@/components/share-link-generator";
import { ShareImageGenerator } from "@/components/share-image-generator";
import React, { useState } from "react";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TagInput } from "@/components/tag-input";

// Helper function to ensure string values
const ensureString = (value: string | null | undefined): string => {
  return value || "";
};

export default function Item() {
  const [, params] = useRoute("/item/:id");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { isAdmin, user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // Get item data
  const { data: item, isLoading } = useQuery<PortfolioItem>({
    queryKey: [`/api/items/${params?.id}`],
  });
  
  // Define form schema for editing
  const formSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    category: z.string().min(1, { message: "Category is required" }),
    tags: z.array(z.string()).optional().nullable(),
    marketplaceUrl1: z.string().optional().transform(v => v || ""),
    marketplaceUrl2: z.string().optional().transform(v => v || ""),
    marketplaceName1: z.string().optional().transform(v => v || ""),
    marketplaceName2: z.string().optional().transform(v => v || ""),
  });
  
  // Set up form with react-hook-form and zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: item?.title || "",
      description: item?.description || "",
      category: item?.category || "",
      tags: item?.tags || [],
      marketplaceUrl1: item?.marketplaceUrl1 || "",
      marketplaceUrl2: item?.marketplaceUrl2 || "",
      marketplaceName1: item?.marketplaceName1 || "",
      marketplaceName2: item?.marketplaceName2 || "",
    },
  });
  
  // Update form values when item data changes
  React.useEffect(() => {
    if (item) {
      form.reset({
        title: item.title,
        description: item.description,
        category: item.category,
        tags: item.tags,
        marketplaceUrl1: item.marketplaceUrl1 || "",
        marketplaceUrl2: item.marketplaceUrl2 || "",
        marketplaceName1: item.marketplaceName1 || "",
        marketplaceName2: item.marketplaceName2 || "",
      });
    }
  }, [item, form]);
  
  // Delete item mutation
  const deleteItemMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", `/api/items/${params?.id}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete item");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Item deleted",
        description: "The portfolio item has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/items"] });
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
  
  // Update item mutation
  const updateItemMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const response = await apiRequest("PATCH", `/api/items/${params?.id}`, data);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update item");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Item updated",
        description: "The portfolio item has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/items/${params?.id}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/items"] });
      setIsEditing(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handle form submission
  function onSubmit(data: z.infer<typeof formSchema>) {
    updateItemMutation.mutate(data);
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <Skeleton className="w-full h-[400px] rounded-lg" />
              <Skeleton className="h-8 w-1/2 mt-6" />
              <Skeleton className="h-4 w-full mt-4" />
              <div className="grid grid-cols-2 gap-4 mt-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (!item) return null;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Left side - Large Image */}
              <div className="md:col-span-7 relative">
                <div className="sticky top-6">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="object-contain w-full max-h-[700px] hover:scale-105 transition-transform duration-300 rounded-lg mx-auto"
                  />
                </div>
              </div>
              
              {/* Right side - Content */}
              <div className="md:col-span-5">
                {/* Title and Category */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold">{item.title}</h1>
                    <Badge variant="secondary" className="text-sm mt-2">
                      <Tag className="w-4 h-4 mr-1" />
                      {item.category}
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    {/* Share on X button */}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const text = `Check out "${item.title}" in this portfolio`;
                        const url = window.location.href;
                        const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
                        window.open(shareUrl, '_blank', 'noopener,noreferrer');
                      }}
                      title="Share on X (Twitter)"
                    >
                      <Twitter className="h-4 w-4" />
                    </Button>
                    
                    {/* Share button - only shows for logged in users */}
                    {user && (
                      <Button 
                        variant="outline" 
                        size="icon"
                        title="Custom Sharing Options" 
                        onClick={() => document.getElementById('share-tab')?.click()}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    )}

                    {/* Edit button - only shows for admins */}
                    {isAdmin && !isEditing && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setIsEditing(true)}
                        title="Edit Item"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {/* Delete button - only shows for admins */}
                    {isAdmin && !isEditing && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Portfolio Item</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{item.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => deleteItemMutation.mutate()}
                              disabled={deleteItemMutation.isPending}
                            >
                              {deleteItemMutation.isPending ? "Deleting..." : "Delete"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}

                    {/* Cancel editing - only shows when editing */}
                    {isEditing && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setIsEditing(false)}
                        title="Cancel Editing"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Edit form - only shows when editing */}
                {isEditing ? (
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
                              <Textarea {...field} rows={4} />
                            </FormControl>
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
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {PORTFOLIO_CATEGORIES.map((category) => (
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
                      
                      <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <FormControl>
                              <TagInput
                                value={field.value || []}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="marketplaceName1"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Marketplace 1 Name</FormLabel>
                              <FormControl>
                                <Input {...field} value={ensureString(field.value)} placeholder="e.g. OBJKT" />
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
                              <FormLabel>Marketplace 1 URL</FormLabel>
                              <FormControl>
                                <Input {...field} value={ensureString(field.value)} placeholder="https://" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="marketplaceName2"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Marketplace 2 Name</FormLabel>
                              <FormControl>
                                <Input {...field} value={ensureString(field.value)} placeholder="e.g. OpenSea" />
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
                              <FormLabel>Marketplace 2 URL</FormLabel>
                              <FormControl>
                                <Input {...field} value={ensureString(field.value)} placeholder="https://" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={updateItemMutation.isPending}
                      >
                        {updateItemMutation.isPending ? (
                          <span className="flex items-center">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving Changes...
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </span>
                        )}
                      </Button>
                    </form>
                  </Form>
                ) : (
                  <>
                    {/* Description */}
                    <div className="mt-6">
                      <h3 className="text-sm font-medium mb-2">Description</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                    
                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-sm font-medium mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {item.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs py-0">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Marketplace Links */}
                    <div className="mt-8 space-y-3">
                      <h3 className="text-sm font-medium mb-3">Available on</h3>
                      {item.marketplaceUrl1 && (
                        <Button asChild size="lg" className="w-full">
                          <a href={item.marketplaceUrl1} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-5 w-5" />
                            View on {item.marketplaceName1}
                          </a>
                        </Button>
                      )}
                      {item.marketplaceUrl2 && (
                        <Button asChild size="lg" variant="secondary" className="w-full">
                          <a href={item.marketplaceUrl2} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-5 w-5" />
                            View on {item.marketplaceName2}
                          </a>
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Share Link Generator Section (for logged in users only) */}
        {user && (
          <Tabs defaultValue="details" className="w-full">
            <div className="flex justify-center mb-4">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="share" id="share-tab">Share Options</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="details">
              {/* No content needed for details tab as it's already displayed above */}
            </TabsContent>
            
            <TabsContent value="share">
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Create Custom Share Link</h3>
                    <ShareLinkGenerator item={item} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Create Shareable Image Card</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Generate a custom image card that combines the portfolio item image with details for sharing on social media platforms.
                    </p>
                    <ShareImageGenerator item={item} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
}