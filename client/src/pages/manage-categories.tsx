import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Edit2, Trash2, Upload, Grid3X3, Download, Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { type CategoryModel } from "@shared/schema";
import { getProxiedImageUrl } from "@/lib/utils";

const categorySchema = z.object({
  name: z.string().min(1, "Collection name is required"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function ManageCategories() {
  const { toast } = useToast();
  const [editingCategory, setEditingCategory] = useState<CategoryModel | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isRefreshingImages, setIsRefreshingImages] = useState(false);

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
    },
  });

  // Fetch categories
  const { data: categories, isLoading } = useQuery<CategoryModel[]>({
    queryKey: ["/api/categories"],
  });

  // Create category mutation
  const createMutation = useMutation({
    mutationFn: async (data: CategoryFormData) => {
      const response = await apiRequest("POST", "/api/categories", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: "Collection created successfully" });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create collection",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update category mutation
  const updateMutation = useMutation({
    mutationFn: async (data: CategoryFormData & { id: number }) => {
      const response = await apiRequest("PATCH", `/api/categories/${data.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: "Collection updated successfully" });
      setIsDialogOpen(false);
      setEditingCategory(null);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update collection",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete category mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/categories/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: "Collection deleted successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete collection",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Enhance existing collections mutation
  const refreshImagesMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/categories/enhance-collections");
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ 
        title: `Successfully enhanced ${data.updated} collections`,
        description: `Updated names and images for collections with imported NFTs. ${data.failed > 0 ? `${data.failed} collections could not be updated.` : ''}`
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to enhance collections",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create preview URL immediately
    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/collections/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      form.setValue("imageUrl", data.imageUrl);
      toast({ title: "Image uploaded successfully" });
      
      // Clear preview after successful upload
      setPreviewImage(null);
      URL.revokeObjectURL(previewUrl);
    } catch (error: any) {
      toast({
        title: "Failed to upload image",
        description: error.message,
        variant: "destructive",
      });
      // Clear preview on error
      setPreviewImage(null);
      URL.revokeObjectURL(previewUrl);
    } finally {
      setUploadingImage(false);
    }
  };

  // Update collection addresses mutation
  const updateAddressesMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/collections/migrate-addresses");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: "Collection addresses updated successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update addresses",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update descriptions mutation
  const updateDescriptionsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/collections/migrate-descriptions");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: "Collection descriptions updated successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update descriptions",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Add OBJKT URLs mutation
  const addObjktUrlsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/items/migrate-objkt-urls");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: "OBJKT URLs added successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to add OBJKT URLs",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Fetch collection data from OBJKT
  const fetchFromObjktMutation = useMutation({
    mutationFn: async (categoryName: string) => {
      const response = await apiRequest("POST", "/api/collections/fetch-from-objkt", { categoryName });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.imageUrl) {
        form.setValue("imageUrl", data.imageUrl);
      }
      if (data.description) {
        form.setValue("description", data.description);
      }
      toast({ title: "Collection data fetched from OBJKT successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to fetch from OBJKT",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle functions
  const handleUpdateAddresses = () => {
    updateAddressesMutation.mutate();
  };

  const handleUpdateDescriptions = () => {
    updateDescriptionsMutation.mutate();
  };

  const handleAddObjktUrls = () => {
    addObjktUrlsMutation.mutate();
  };

  const handleFetchFromObjkt = () => {
    if (editingCategory) {
      fetchFromObjktMutation.mutate(editingCategory.name);
    }
  };

  // Handle enhance collections
  const handleRefreshImages = () => {
    setIsRefreshingImages(true);
    refreshImagesMutation.mutate();
    setIsRefreshingImages(false);
  };

  const onSubmit = (data: CategoryFormData) => {
    if (editingCategory) {
      updateMutation.mutate({ ...data, id: editingCategory.id });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (category: CategoryModel) => {
    setEditingCategory(category);
    form.reset({
      name: category.name,
      description: category.description || "",
      imageUrl: category.imageUrl || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (category: CategoryModel) => {
    if (confirm(`Are you sure you want to delete the collection "${category.name}"?`)) {
      deleteMutation.mutate(category.id);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingCategory(null);
    form.reset();
    // Clear preview image when closing dialog
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
      setPreviewImage(null);
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Manage Collections</h1>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {/* TODO: Sort functionality */}}
          >
            Sort by: Date Added ↑
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleUpdateAddresses}
            disabled={updateAddressesMutation.isPending}
          >
            {updateAddressesMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Update Collection Addresses
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleUpdateDescriptions}
            disabled={updateDescriptionsMutation.isPending}
          >
            {updateDescriptionsMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Edit2 className="mr-2 h-4 w-4" />
            )}
            Update Descriptions
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddObjktUrls}
            disabled={addObjktUrlsMutation.isPending}
          >
            {addObjktUrlsMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Add OBJKT URLs
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" />
                Add New
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>



      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Collection" : "Create New Collection"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory ? "Update collection details" : "Add a new collection to organize your portfolio items"}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
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
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter collection description" 
                        className="resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    Image URL
                  </Button>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploadingImage}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={uploadingImage}
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Image
                    </Button>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleFetchFromObjkt}
                    disabled={fetchFromObjktMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    {fetchFromObjktMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    Fetch from OBJKT
                  </Button>
                </div>

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Collection Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Provide a URL to an image that represents this collection" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {(form.watch("imageUrl") || previewImage) && (
                  <div>
                    <FormLabel>Image Preview:</FormLabel>
                    <div className="flex gap-4 mt-2">
                      {/* Upload preview (temporary) */}
                      {previewImage && (
                        <div className="relative">
                          <div className="w-24 h-24 border rounded overflow-hidden">
                            <img
                              src={previewImage}
                              alt="Uploading preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {uploadingImage && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
                              <Loader2 className="h-4 w-4 animate-spin text-white" />
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground mt-1">Uploading...</div>
                        </div>
                      )}
                      
                      {/* Final uploaded image */}
                      {form.watch("imageUrl") && !previewImage && (
                        <div>
                          <div className="w-32 h-32 border rounded overflow-hidden">
                            <img
                              src={getProxiedImageUrl(form.watch("imageUrl") || "")}
                              alt="Collection image"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">Current image</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {editingCategory ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <div className="h-32 bg-muted"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : categories && categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="overflow-hidden">
              <div className="relative h-32">
                {category.imageUrl ? (
                  <img
                    src={getProxiedImageUrl(category.imageUrl)}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <Grid3X3 className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(category)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {category.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {category.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Grid3X3 className="h-16 w-16 text-muted-foreground mb-4 mx-auto" />
          <h3 className="text-xl font-medium mb-2">No collections found</h3>
          <p className="text-muted-foreground mb-4">
            Create your first collection to organize your portfolio items.
          </p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Collection
          </Button>
        </Card>
      )}
    </Layout>
  );
}