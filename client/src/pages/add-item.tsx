import { useState } from "react";
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
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { insertPortfolioItemSchema, type InsertPortfolioItem, type Category } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function AddItem() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const form = useForm<InsertPortfolioItem>({
    resolver: zodResolver(insertPortfolioItemSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      category: "Digital Art",
      marketplaceUrl1: "",
      marketplaceUrl2: "",
      marketplaceName1: "",
      marketplaceName2: "",
    },
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
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

  async function onSubmit(data: InsertPortfolioItem) {
    createItemMutation.mutate(data);
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
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input {...field} type="url" placeholder="https://..." />
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="marketplaceName1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Marketplace Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., OpenSea" />
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
                        <Input {...field} type="url" placeholder="https://..." />
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
                        <Input {...field} placeholder="e.g., Foundation" />
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
                        <Input {...field} type="url" placeholder="https://..." />
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
              disabled={createItemMutation.isPending}
            >
              {createItemMutation.isPending ? "Adding..." : "Add Item"}
            </Button>
          </form>
        </Form>
      </div>
    </Layout>
  );
}
