import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Download, Share } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import type { PortfolioItem } from "@shared/schema";

interface ShareImageGeneratorProps {
  item: PortfolioItem;
}

export function ShareImageGenerator({ item }: ShareImageGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Generate the card image
  const generateImage = async () => {
    setIsGenerating(true);
    
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      // Canvas dimensions
      const width = 1200;
      const height = 630;
      canvas.width = width;
      canvas.height = height;
      
      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#1a1a1a");
      gradient.addColorStop(1, "#121212");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      // Add border
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 8;
      ctx.strokeRect(20, 20, width - 40, height - 40);
      
      // Load and draw the item image
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = item.imageUrl;
      });
      
      // Calculate image position and size to maintain aspect ratio
      const imageWidth = 500;
      const imgAspectRatio = img.width / img.height;
      const imageHeight = imageWidth / imgAspectRatio;
      const imageX = 50;
      const imageY = (height - imageHeight) / 2;
      
      // Draw image with a border
      ctx.fillStyle = "#fff";
      ctx.fillRect(imageX - 5, imageY - 5, imageWidth + 10, imageHeight + 10);
      ctx.drawImage(img, imageX, imageY, imageWidth, imageHeight);
      
      // Title
      ctx.font = "bold 48px system-ui, sans-serif";
      ctx.fillStyle = "#fff";
      ctx.textBaseline = "top";
      wrapText(ctx, item.title, 600, 100, width - 650, 60);
      
      // Description
      ctx.font = "24px system-ui, sans-serif";
      ctx.fillStyle = "#aaa";
      wrapText(ctx, item.description, 600, 240, width - 650, 30);
      
      // Category
      ctx.font = "bold 30px system-ui, sans-serif";
      ctx.fillStyle = "#9333ea";
      ctx.fillText(`#${item.category.replace(/\s+/g, "")}`, 600, 400);
      
      // Tags
      if (item.tags && item.tags.length > 0) {
        ctx.font = "20px system-ui, sans-serif";
        ctx.fillStyle = "#666";
        let tagText = item.tags.map(tag => `#${tag.replace(/\s+/g, "")}`).join("  ");
        wrapText(ctx, tagText, 600, 450, width - 650, 30);
      }
      
      // Footer with website URL
      ctx.font = "22px system-ui, sans-serif";
      ctx.fillStyle = "#666";
      ctx.textBaseline = "bottom";
      ctx.fillText(window.location.host, 600, height - 50);
      
      // Convert canvas to image URL
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      setImageUrl(dataUrl);
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Error",
        description: "Failed to generate share image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Helper function to wrap text
  function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
    const words = text.split(" ");
    let line = "";
    let dy = 0;
    
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > maxWidth && i > 0) {
        ctx.fillText(line, x, y + dy);
        line = words[i] + " ";
        dy += lineHeight;
      } else {
        line = testLine;
      }
    }
    
    // Draw the last line
    ctx.fillText(line, x, y + dy);
    return dy;
  }
  
  // Download the generated image
  const downloadImage = () => {
    if (!imageUrl) return;
    
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `${item.title.replace(/\s+/g, "-").toLowerCase()}-share.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Generate image when dialog opens
  useEffect(() => {
    if (isDialogOpen && !imageUrl) {
      generateImage();
    }
  }, [isDialogOpen]);
  
  return (
    <>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full mt-4">
            <Share className="mr-2 h-4 w-4" />
            Create Shareable Image
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Shareable Image Card</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col items-center space-y-4">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-sm text-muted-foreground">Generating image...</p>
              </div>
            ) : imageUrl ? (
              <>
                <div className="border rounded-md overflow-hidden">
                  <img 
                    src={imageUrl} 
                    alt={`Sharable card for ${item.title}`} 
                    className="max-w-full h-auto"
                  />
                </div>
                
                <div className="flex items-center justify-center gap-4 mt-4">
                  <Button onClick={downloadImage}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Image
                  </Button>
                  
                  <Button 
                    onClick={() => {
                      if (!imageUrl) return;
                      
                      const text = `Check out "${item.title}" from my portfolio`;
                      const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
                      window.open(shareUrl, '_blank', 'noopener,noreferrer');
                    }}
                  >
                    Share on X
                  </Button>
                </div>
                
                <p className="text-sm text-muted-foreground mt-2">
                  Download the image and attach it when sharing on social media platforms.
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Failed to generate image. Please try again.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}