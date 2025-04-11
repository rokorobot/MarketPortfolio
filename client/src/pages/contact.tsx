import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Mail, Phone, MapPin, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function ContactPage() {
  const { toast } = useToast();
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // Fetch site settings
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
  
  // Contact form mutation
  const contactMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const response = await apiRequest('POST', '/api/contact', data);
      const result = await response.json();
      
      // Check if the API returned an error
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to send message');
      }
      
      return result;
    },
    onSuccess: () => {
      setFormStatus('success');
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });
      form.reset();
    },
    onError: (error: Error) => {
      setFormStatus('error');
      console.error("Contact form error:", error);
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    }
  });
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setFormStatus('idle');
    contactMutation.mutate(values);
  }

  // Show loading state while fetching settings
  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[40vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }
  
  // Format the office address for display (replace newlines with <br> tags)
  const formatOfficeAddress = () => {
    const officeAddress = settings?.office_address || '';
    
    if (!officeAddress) return null;
    
    const addressLines = officeAddress.split('\n');
    return addressLines.map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < addressLines.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
          <p className="text-muted-foreground mb-8">
            Have questions or feedback? We'd love to hear from you. Fill out the form
            and we'll get back to you as soon as possible.
          </p>
          
          <div className="space-y-6">
            {settings?.email_contact && (
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-muted-foreground">{settings.email_contact}</p>
                </div>
              </div>
            )}
            
            {settings?.phone_contact && (
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p className="text-muted-foreground">{settings.phone_contact}</p>
                </div>
              </div>
            )}
            
            {settings?.office_address && (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">Office</h3>
                  <p className="text-muted-foreground">
                    {formatOfficeAddress()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-card p-6 rounded-lg border">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="How can we help you?" 
                        className="min-h-32"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {formStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4 flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-800">Message Sent Successfully!</h4>
                    <p className="text-green-700 text-sm">
                      {contactMutation.data?.message || "Thank you for your message. We'll respond as soon as possible."}
                    </p>
                  </div>
                </div>
              )}
              
              {formStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-800">Failed to send message</h4>
                    <p className="text-red-700 text-sm">
                      {!settings?.email_contact 
                        ? "Admin email is not configured. Please set up the email_contact in site settings."
                        : contactMutation.error instanceof Error && contactMutation.error.message
                          ? contactMutation.error.message
                          : "There was a problem sending your message. Please try again later."}
                    </p>
                  </div>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={contactMutation.isPending}
              >
                {contactMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Sending...</span>
                  </div>
                ) : "Send Message"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </Layout>
  );
}