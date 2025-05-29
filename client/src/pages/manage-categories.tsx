import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, useLocation, Link } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { getProxiedImageUrl } from "@/lib/utils";
import { insertCategorySchema, type CategoryModel } from "@shared/schema";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import { Loader2, Pencil, Trash2, Plus, AlertCircle, ArrowUp, ArrowDown, X, Upload, Image as ImageIcon, User, RefreshCw } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Extend the schema with additional validation
const formSchema = insertCategorySchema
  .extend({
    name: z.string().min(3, "Name must be at least 3 characters").max(50, "Name must be less than 50 characters"),
    description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description must be less than 500 characters").nullable(),
  });

// Create a schema for editing existing categories
const editFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(50, "Name must be less than 50 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description must be less than 500 characters").nullable(),
  imageUrl: z.string().nullable().optional(),
});

type EditFormValues = z.infer<typeof editFormSchema>;

// List of system (built-in) categories that can't be edited or deleted
const SYSTEM_CATEGORIES = [
  "Digital Art",
  "Photography",
  "3D Models",
  "Music",
  "Collectibles",
  "Gaming Assets"
];

export default function ManageCategories() {
  const { toast } = useToast();
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [editingCategory, setEditingCategory] = useState<CategoryModel | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryModel | null>(null);
  const [sortType, setSortType] = useState<'name' | 'date'>('date');
  const [activeTab, setActiveTab] = useState<string>("url");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadedImagePath, setUploadedImagePath] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Fetch all categories from the database
  const { data: categories = [], isLoading: categoriesLoading, refetch: refetchCategories } = useQuery<CategoryModel[]>({
    queryKey: ["/api/categories"],
    staleTime: 0, // Don't use cached data
    refetchOnMount: true, // Always refetch when component mounts
    retry: 3, // Retry failed requests up to 3 times
    initialData: [], // Start with empty array to avoid undefined
  });
  
  // Form for adding new categories
  const addForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  
  // Form for editing categories
  const editForm = useForm<EditFormValues>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
    },
  });
  
  // Force fetch categories when component mounts 
  useEffect(() => {
    // Refetch categories on component mount
    refetchCategories();
  }, [refetchCategories]);
  
  // Set up edit form when a category is selected for editing
  useEffect(() => {
    if (editingCategory) {
      editForm.reset({
        name: editingCategory.name,
        description: editingCategory.description,
        imageUrl: editingCategory.imageUrl || "",
      });
      
      // Reset the upload states
      setPreviewImage(null);
      setUploadedImagePath(null);
      setActiveTab("url");
    }
  }, [editingCategory, editForm]);
  
  // Add category mutation
  const addCategoryMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const response = await apiRequest("POST", "/api/categories", data);
      return await response.json();
    },
    onSuccess: () => {
      // Reset the form
      addForm.reset();
      
      // Invalidate all categories queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      queryClient.invalidateQueries({ queryKey: ['/api/category-options'] });
      
      toast({
        title: "Success",
        description: "Collection has been created successfully",
      });
      
      // Refetch categories
      refetchCategories();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to create collection: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Edit category mutation
  const editCategoryMutation = useMutation({
    mutationFn: async (data: { id: number; update: EditFormValues }) => {
      // If using the upload tab and we have an uploaded path, use that instead
      if (activeTab === "upload" && uploadedImagePath) {
        data.update.imageUrl = uploadedImagePath;
      }
      
      const response = await apiRequest("PATCH", `/api/categories/${data.id}`, data.update);
      return await response.json();
    },
    onSuccess: () => {
      // Close the edit dialog
      setIsEditDialogOpen(false);
      setEditingCategory(null);
      
      // Reset upload states
      setPreviewImage(null);
      setUploadedImagePath(null);
      setActiveTab("url");
      
      // Invalidate all categories queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      queryClient.invalidateQueries({ queryKey: ['/api/category-options'] });
      
      toast({
        title: "Success",
        description: "Collection has been updated successfully",
      });
      
      // Refetch categories
      refetchCategories();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update collection: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // OBJKT collection fetch mutation
  const fetchObjktCollectionMutation = useMutation({
    mutationFn: async (collectionName: string) => {
      const response = await fetch(`/api/collections/${encodeURIComponent(collectionName)}/fetch-objkt-profile`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch collection from OBJKT');
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      // Update form with the fetched collection data
      if (data.name) {
        editForm.setValue("name", data.name);
      }
      if (data.collectionImage) {
        editForm.setValue("imageUrl", data.collectionImage);
        setPreviewImage(data.collectionImage);
      }
      if (data.description) {
        editForm.setValue("description", data.description);
      }
      
      // Invalidate categories cache to refresh the list
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/category-options"] });
      
      toast({
        title: "Success",
        description: data.message,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to fetch collection: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Image upload mutation
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

  // Collection address migration mutation
  const migrateCollectionAddressesMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/collections/migrate-addresses");
      return await response.json();
    },
    onSuccess: () => {
      // Invalidate all categories queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      queryClient.invalidateQueries({ queryKey: ['/api/category-options'] });
      
      toast({
        title: "Success",
        description: "Collection addresses updated successfully",
      });
      
      // Refetch categories
      refetchCategories();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update collection addresses: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/categories/${id}`);
      return await response.json();
    },
    onSuccess: () => {
      // Reset the category to delete
      setCategoryToDelete(null);
      
      // Invalidate all categories queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      queryClient.invalidateQueries({ queryKey: ['/api/category-options'] });
      
      toast({
        title: "Success",
        description: "Collection has been deleted successfully",
      });
      
      // Refetch categories
      refetchCategories();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to delete collection: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Handle form submission for adding a new category
  async function onAddSubmit(data: z.infer<typeof formSchema>) {
    await addCategoryMutation.mutate(data);
  }
  
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
  
  // Handle form submission for editing a category
  async function onEditSubmit(data: EditFormValues) {
    if (!editingCategory) return;
    
    await editCategoryMutation.mutate({
      id: editingCategory.id,
      update: data
    });
  }
  
  // Handle category deletion
  async function handleDeleteCategory() {
    if (!categoryToDelete) return;
    await deleteCategoryMutation.mutate(categoryToDelete.id);
  }
  
  // Check if a category is a system category (cannot be edited or deleted)
  const isSystemCategory = (name: string) => SYSTEM_CATEGORIES.includes(name);
  
  // Sort categories based on the selected sort type
  const sortedCategories = [...categories].sort((a, b) => {
    if (sortType === 'name') {
      return a.name.localeCompare(b.name);
    } else {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });
  
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
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Manage Collections</h1>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setSortType(sortType === 'name' ? 'date' : 'name')}
            >
              Sort by: {sortType === 'name' ? 'Name' : 'Date Added'}
              {sortType === 'name' ? <ArrowDown className="ml-2 h-4 w-4" /> : <ArrowUp className="ml-2 h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              onClick={() => migrateCollectionAddressesMutation.mutate()}
              disabled={migrateCollectionAddressesMutation.isPending}
            >
              {migrateCollectionAddressesMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Update Collection Addresses
                </>
              )}
            </Button>
            <Button onClick={() => navigate("/add-collection")}>
              <Plus className="mr-2 h-4 w-4" />
              Add New
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {categoriesLoading ? (
            <div className="col-span-full flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : sortedCategories.length === 0 ? (
            <div className="col-span-full bg-muted p-8 rounded-lg text-center">
              <AlertCircle className="h-10 w-10 mx-auto mb-2" />
              <h3 className="text-lg font-medium">No collections found</h3>
              <p className="text-muted-foreground mt-2">
                Add your first collection to get started
              </p>
            </div>
          ) : (
            sortedCategories.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {category.name}
                        {isSystemCategory(category.name) && (
                          <Badge variant="secondary">System</Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        Created on {new Date(category.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {!isSystemCategory(category.name) && (
                        <>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => {
                              setEditingCategory(category);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="icon" onClick={() => setCategoryToDelete(category)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Category</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete the "{category.name}" category? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setCategoryToDelete(null)}>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={handleDeleteCategory}
                                  className="bg-destructive text-destructive-foreground"
                                >
                                  {deleteCategoryMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    "Delete"
                                  )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {category.imageUrl && (
                    <div className="mb-4">
                      <img 
                        src={getProxiedImageUrl(category.imageUrl)} 
                        alt={category.name}
                        className="w-full h-40 object-cover rounded-md" 
                        onError={(e) => {
                          e.currentTarget.src = "https://placehold.co/400x150/gray/white?text=Collection+Image";
                          console.log('Card image failed to load:', category.imageUrl);
                        }}
                        crossOrigin="anonymous"
                      />
                    </div>
                  )}
                  <p className="text-muted-foreground">
                    {category.description || "No description provided"}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        
        <Separator className="my-8" />
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">Add New Collection</h2>
          
          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-8 max-w-2xl">
              <FormField
                control={addForm.control}
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
                control={addForm.control}
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
            </form>
          </Form>
        </div>
      </div>
      
      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Collection</DialogTitle>
            <DialogDescription>
              Update the details for the "{editingCategory?.name}" collection.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-6">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Collection Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter collection name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="pb-4">
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
                    {editingCategory && (
                      <TabsTrigger value="objkt">
                        <User className="h-4 w-4 mr-2" />
                        Fetch from OBJKT
                      </TabsTrigger>
                    )}
                  </TabsList>
                  
                  <TabsContent value="url">
                    <FormField
                      control={editForm.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Collection Image URL</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter URL to collection image" 
                              {...field} 
                              value={field.value || ""} 
                              disabled={activeTab !== "url"}
                            />
                          </FormControl>
                          <FormDescription>
                            Provide a URL to an image that represents this collection
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
                  
                  {editingCategory && (
                    <TabsContent value="objkt">
                      <div className="space-y-4">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-4">
                            Fetch the official collection name and image from OBJKT.com using the blockchain contract data
                          </p>
                          <Button
                            type="button"
                            onClick={() => fetchObjktCollectionMutation.mutate(editingCategory.name)}
                            disabled={fetchObjktCollectionMutation.isPending}
                            className="w-full"
                          >
                            {fetchObjktCollectionMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Fetching from OBJKT...
                              </>
                            ) : (
                              <>
                                <User className="mr-2 h-4 w-4" />
                                Fetch Collection from OBJKT
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  )}
                </Tabs>
                
                {(editForm.watch("imageUrl") || previewImage) && (
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
                        src={getProxiedImageUrl(previewImage || editForm.watch("imageUrl") || "")} 
                        alt="Collection preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.log('Edit Collection preview image failed to load:', previewImage || editForm.watch("imageUrl"));
                          e.currentTarget.src = "https://placehold.co/200x200/gray/white?text=Invalid+Image";
                        }}
                        crossOrigin="anonymous"
                      />
                    </Card>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingCategory(null);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={editCategoryMutation.isPending}
                >
                  {editCategoryMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}