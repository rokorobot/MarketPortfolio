import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Copy, Link, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { ShareLink, PortfolioItem } from "@shared/schema";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface ShareLinkGeneratorProps {
  item: PortfolioItem;
}

interface ExtendedShareLink extends ShareLink {
  shareUrl: string;
}

export function ShareLinkGenerator({ item }: ShareLinkGeneratorProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [customTitle, setCustomTitle] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  
  // Query to fetch existing share links for the item
  const { data: shareLinks, isLoading: isLoadingLinks } = useQuery<ExtendedShareLink[]>({
    queryKey: [`/api/items/${item.id}/share-links`],
    enabled: !!user && !!item.id,
  });
  
  // Mutation to create a new share link
  const createShareLinkMutation = useMutation({
    mutationFn: async () => {
      const shareData = {
        itemId: item.id,
        customTitle: customTitle || null,
        customDescription: customDescription || null,
        customImageUrl: customImageUrl || null,
        expiresAt: expiryDate ? new Date(expiryDate).toISOString() : null,
        // shareCode is intentionally omitted as it will be generated server-side
      };
      
      const res = await apiRequest("POST", "/api/share-links", shareData);
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create share link");
      }
      
      return await res.json();
    },
    onSuccess: () => {
      // Reset form and invalidate query to refresh the links
      setCustomTitle("");
      setCustomDescription("");
      setCustomImageUrl("");
      setExpiryDate("");
      queryClient.invalidateQueries({ queryKey: [`/api/items/${item.id}/share-links`] });
      
      toast({
        title: "Share link created",
        description: "Your custom share link has been created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create share link",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Mutation to delete a share link
  const deleteShareLinkMutation = useMutation({
    mutationFn: async (shareId: number) => {
      await apiRequest("DELETE", `/api/share-links/${shareId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/items/${item.id}/share-links`] });
      toast({
        title: "Share link deleted",
        description: "The share link has been deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete share link",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Function to copy share link to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Copied to clipboard",
          description: "Share link copied successfully",
        });
      },
      (err) => {
        toast({
          title: "Failed to copy",
          description: "Could not copy to clipboard: " + err,
          variant: "destructive",
        });
      }
    );
  };
  
  const handleCreateShareLink = () => {
    createShareLinkMutation.mutate();
  };
  
  const handleDeleteShareLink = (shareId: number) => {
    deleteShareLinkMutation.mutate(shareId);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create a Share Link</CardTitle>
          <CardDescription>
            Create a customized, shareable link for this portfolio item.
            You can customize the preview that appears when the link is shared.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customTitle">Custom Title (Optional)</Label>
            <Input 
              id="customTitle" 
              value={customTitle} 
              onChange={(e) => setCustomTitle(e.target.value)} 
              placeholder={item.title}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="customDescription">Custom Description (Optional)</Label>
            <Textarea 
              id="customDescription" 
              value={customDescription} 
              onChange={(e) => setCustomDescription(e.target.value)} 
              placeholder={item.description}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="customImageUrl">Custom Image URL (Optional)</Label>
            <Input 
              id="customImageUrl" 
              value={customImageUrl} 
              onChange={(e) => setCustomImageUrl(e.target.value)} 
              placeholder="Leave empty to use the original image"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
            <Input 
              id="expiryDate" 
              type="datetime-local" 
              value={expiryDate} 
              onChange={(e) => setExpiryDate(e.target.value)} 
            />
            <p className="text-sm text-muted-foreground">The share link will become invalid after this date.</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleCreateShareLink} 
            disabled={createShareLinkMutation.isPending}
          >
            {createShareLinkMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Link className="mr-2 h-4 w-4" />
                Create Share Link
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Existing Share Links</CardTitle>
          <CardDescription>
            These are all the custom share links you've created for this item.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingLinks ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : !shareLinks || shareLinks.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No share links created yet.</p>
          ) : (
            <div className="space-y-4">
              {shareLinks.map((link) => (
                <div key={link.id} className="flex items-center justify-between border p-3 rounded-md">
                  <div className="overflow-hidden mr-2">
                    <p className="font-medium truncate">{link.customTitle || item.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{link.shareUrl}</p>
                    <div className="flex items-center mt-1">
                      <p className="text-xs text-muted-foreground">
                        Clicks: {link.clicks}
                        {link.expiresAt && ` • Expires: ${new Date(link.expiresAt).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      size="icon" 
                      variant="outline" 
                      onClick={() => copyToClipboard(link.shareUrl)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Share Link</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this share link? Anyone using this link will no longer be able to access the item.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => handleDeleteShareLink(link.id)}
                            disabled={deleteShareLinkMutation.isPending}
                          >
                            {deleteShareLinkMutation.isPending ? "Deleting..." : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}