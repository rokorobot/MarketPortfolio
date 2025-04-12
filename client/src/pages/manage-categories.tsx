import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, useLocation, Link } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
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
import { Loader2, Pencil, Trash2, Plus, AlertCircle, ArrowUp, ArrowDown } from "lucide-react";
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
      const response = await apiRequest("PATCH", `/api/categories/${data.id}`, data.update);
      return await response.json();
    },
    onSuccess: () => {
      // Close the edit dialog
      setIsEditDialogOpen(false);
      setEditingCategory(null);
      
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
                        src={category.imageUrl} 
                        alt={category.name}
                        className="w-full h-40 object-cover rounded-md" 
                        onError={(e) => {
                          e.currentTarget.src = "https://placehold.co/400x150/gray/white?text=Collection+Image";
                        }}
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
              
              <FormField
                control={editForm.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Collection Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter URL to collection image" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>
                      Provide a URL to an image that represents this collection
                    </FormDescription>
                    {field.value && (
                      <div className="mt-2">
                        <p className="text-sm mb-1">Image Preview:</p>
                        <img 
                          src={field.value} 
                          alt="Collection preview" 
                          className="max-w-[200px] max-h-[150px] object-cover rounded-md border"
                          onError={(e) => {
                            e.currentTarget.src = "https://placehold.co/200x150/gray/white?text=Invalid+Image";
                          }}
                        />
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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