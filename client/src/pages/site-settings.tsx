import { Layout } from "@/components/layout";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useState, useEffect } from "react";
import { Loader2, Save } from "lucide-react";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

type SiteSettingsType = {
  twitter_url: string;
  instagram_url: string;
  email_contact: string;
  phone_contact: string;
  office_address: string;
  grid_columns_desktop: string;
  grid_columns_tablet: string;
  grid_columns_mobile: string;
  items_per_page: string;
};

export default function SiteSettings() {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formValues, setFormValues] = useState<SiteSettingsType>({
    twitter_url: '',
    instagram_url: '',
    email_contact: '',
    phone_contact: '',
    office_address: '',
    grid_columns_desktop: '3',
    grid_columns_tablet: '2',
    grid_columns_mobile: '1',
    items_per_page: '12'
  });
  
  const { data: settings, isLoading } = useQuery<Record<string, string | null>, Error>({
    queryKey: ['/api/site-settings'],
    queryFn: async () => {
      const res = await fetch('/api/site-settings');
      if (!res.ok) {
        throw new Error('Failed to fetch site settings');
      }
      return await res.json() as Record<string, string | null>;
    }
  });
  
  // Set form values when settings data is loaded
  useEffect(() => {
    if (settings) {
      setFormValues({
        twitter_url: settings.twitter_url || '',
        instagram_url: settings.instagram_url || '',
        email_contact: settings.email_contact || '',
        phone_contact: settings.phone_contact || '',
        office_address: settings.office_address || '',
        grid_columns_desktop: settings.grid_columns_desktop || '3',
        grid_columns_tablet: settings.grid_columns_tablet || '2',
        grid_columns_mobile: settings.grid_columns_mobile || '1',
        items_per_page: settings.items_per_page || '12'
      });
    }
  }, [settings]);
  
  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string, value: string }) => {
      const res = await apiRequest('POST', '/api/site-settings', { key, value });
      if (!res.ok) {
        throw new Error(`Failed to update ${key}`);
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/site-settings'] });
      toast({
        title: 'Settings updated',
        description: 'Your settings have been saved successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update each setting
    for (const [key, value] of Object.entries(formValues)) {
      await updateSettingMutation.mutateAsync({ key, value });
    }
  };
  
  // Show loading state
  if (authLoading || isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[40vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }
  
  // Redirect if not an admin
  if (!isAdmin) {
    return <Redirect to="/" />;
  }
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Site Settings</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Social Media Settings</CardTitle>
            <CardDescription>
              Configure social media accounts that will appear in the footer and sharing links.
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="twitter_url" className="text-sm font-medium">
                  X (Twitter) URL
                </label>
                <Input
                  id="twitter_url"
                  name="twitter_url"
                  value={formValues.twitter_url}
                  onChange={handleInputChange}
                  placeholder="https://twitter.com/yourusername"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="instagram_url" className="text-sm font-medium">
                  Instagram URL
                </label>
                <Input
                  id="instagram_url"
                  name="instagram_url"
                  value={formValues.instagram_url}
                  onChange={handleInputChange}
                  placeholder="https://instagram.com/yourusername"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email_contact" className="text-sm font-medium">
                  Contact Email
                </label>
                <Input
                  id="email_contact"
                  name="email_contact"
                  value={formValues.email_contact}
                  onChange={handleInputChange}
                  placeholder="contact@example.com"
                />
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                disabled={updateSettingMutation.isPending}
                className="w-full sm:w-auto"
              >
                {updateSettingMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {!updateSettingMutation.isPending && (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Settings
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              Configure contact details that will appear on the Contact page.
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="phone_contact" className="text-sm font-medium">
                  Phone Number
                </label>
                <Input
                  id="phone_contact"
                  name="phone_contact"
                  value={formValues.phone_contact}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="office_address" className="text-sm font-medium">
                  Office Address
                </label>
                <Textarea
                  id="office_address"
                  name="office_address"
                  value={formValues.office_address}
                  onChange={handleInputChange}
                  placeholder="123 Portfolio Street&#10;Creative District&#10;New York, NY 10001"
                  rows={3}
                />
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                disabled={updateSettingMutation.isPending}
                className="w-full sm:w-auto"
              >
                {updateSettingMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {!updateSettingMutation.isPending && (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Settings
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Grid Layout</CardTitle>
            <CardDescription>
              Configure how portfolio items are displayed on the homepage.
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="grid_columns_desktop" className="text-sm font-medium">
                    Desktop Columns
                  </label>
                  <Input
                    id="grid_columns_desktop"
                    name="grid_columns_desktop"
                    type="number"
                    min="1"
                    max="6"
                    value={formValues.grid_columns_desktop}
                    onChange={handleInputChange}
                    placeholder="3"
                  />
                  <p className="text-xs text-muted-foreground">
                    Number of columns on desktop screens (≥1024px)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="grid_columns_tablet" className="text-sm font-medium">
                    Tablet Columns
                  </label>
                  <Input
                    id="grid_columns_tablet"
                    name="grid_columns_tablet"
                    type="number"
                    min="1"
                    max="4"
                    value={formValues.grid_columns_tablet}
                    onChange={handleInputChange}
                    placeholder="2"
                  />
                  <p className="text-xs text-muted-foreground">
                    Number of columns on tablet screens (≥768px)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="grid_columns_mobile" className="text-sm font-medium">
                    Mobile Columns
                  </label>
                  <Input
                    id="grid_columns_mobile"
                    name="grid_columns_mobile"
                    type="number"
                    min="1"
                    max="2"
                    value={formValues.grid_columns_mobile}
                    onChange={handleInputChange}
                    placeholder="1"
                  />
                  <p className="text-xs text-muted-foreground">
                    Number of columns on mobile screens (&lt;768px)
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="items_per_page" className="text-sm font-medium">
                  Items Per Page
                </label>
                <Input
                  id="items_per_page"
                  name="items_per_page"
                  type="number"
                  min="4"
                  max="48"
                  step="4"
                  value={formValues.items_per_page}
                  onChange={handleInputChange}
                  placeholder="12"
                />
                <p className="text-xs text-muted-foreground">
                  Number of items to display per page (multiples of 4 recommended)
                </p>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                disabled={updateSettingMutation.isPending}
                className="w-full sm:w-auto"
              >
                {updateSettingMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {!updateSettingMutation.isPending && (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Layout Settings
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
}