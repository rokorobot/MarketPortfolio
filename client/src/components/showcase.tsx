import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogClose, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, Pause, Play } from "lucide-react";
import { PortfolioItem } from "@shared/schema";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ShowcaseProps {
  items: PortfolioItem[];
  isOpen: boolean;
  onClose: () => void;
}

export function Showcase({ items, isOpen, onClose }: ShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [showControls, setShowControls] = useState(false);
  
  const currentItem = items[currentIndex];
  
  // Handle autoplay
  useEffect(() => {
    if (isAutoplay && isOpen) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % items.length);
      }, 8000); // Change slide every 8 seconds
      
      setTimer(interval);
      
      return () => {
        if (interval) clearInterval(interval);
      };
    } else if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  }, [isAutoplay, isOpen, items.length]);
  
  // Reset state when dialog is closed
  useEffect(() => {
    if (!isOpen) {
      setCurrentIndex(0);
      setIsAutoplay(true);
      if (timer) {
        clearInterval(timer);
        setTimer(null);
      }
    }
  }, [isOpen]);
  
  // Go to previous item
  const handlePrevious = () => {
    setCurrentIndex(prev => (prev - 1 + items.length) % items.length);
    setIsAutoplay(false);
  };
  
  // Go to next item
  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % items.length);
    setIsAutoplay(false);
  };
  
  // Toggle autoplay
  const toggleAutoplay = () => {
    setIsAutoplay(prev => !prev);
  };

  // Toggle controls visibility
  const toggleControls = () => {
    setShowControls(prev => !prev);
  };
  
  // Handle keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === ' ' || e.key === 'Spacebar') {
        toggleAutoplay();
        e.preventDefault();
      } else if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'c') {
        toggleControls();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);
  
  if (!currentItem) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="w-screen h-screen max-w-none max-h-none p-0 bg-black text-white overflow-hidden border-none rounded-none" aria-describedby="showcase-description">
        <DialogTitle>
          <VisuallyHidden>Portfolio Showcase</VisuallyHidden>
        </DialogTitle>
        <VisuallyHidden id="showcase-description">
          A fullscreen slideshow of portfolio items with navigation controls.
        </VisuallyHidden>
        <div 
          className="relative w-full h-full flex flex-col items-center justify-center"
          onClick={toggleControls}
        >
          {/* Full screen image with title overlay */}
          <div className="absolute inset-0 w-full h-full flex items-center justify-center">
            <img 
              src={currentItem.imageUrl} 
              alt={currentItem.title}
              className="max-w-[90vw] max-h-[80vh] object-contain"
            />
          </div>
          
          {/* Title and controls overlay - always visible at bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col items-center">
                <h2 className="text-3xl font-bold mb-1">{currentItem.title}</h2>
                {currentItem.author && (
                  <p className="text-lg text-gray-300 mb-3">
                    By {currentItem.author}
                  </p>
                )}
                
                {/* Controls at bottom */}
                <div className="flex items-center gap-4 mt-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevious();
                    }}
                  >
                    <ChevronLeft className="h-5 w-5 mr-1" />
                    Previous
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAutoplay();
                    }}
                  >
                    {isAutoplay ? (
                      <>
                        <Pause className="h-4 w-4 mr-1" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-1" />
                        Play
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline"
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                  >
                    Next
                    <ChevronRight className="h-5 w-5 ml-1" />
                  </Button>
                  
                  <Button 
                    variant="outline"
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                    }}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Exit (ESC)
                  </Button>
                </div>
                
                <div className="mt-2 text-white/70 text-sm flex items-center justify-center gap-8">
                  <span>{currentIndex + 1} of {items.length}</span>
                  <span className="text-white/50 text-xs">Press ESC to exit</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Controls overlay - toggle visibility */}
          {showControls && (
            <>
              {/* Close button in the corner */}
              <DialogClose className="absolute top-4 right-4 z-10">
                <Button size="icon" variant="ghost" className="text-white hover:bg-black/30">
                  <X className="h-6 w-6" />
                  <span className="sr-only">Close</span>
                </Button>
              </DialogClose>
              
              {/* Control panel */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/40 p-2 rounded-lg">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAutoplay();
                  }}
                  className="text-white hover:bg-black/30"
                >
                  {isAutoplay ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </Button>
                
                <div className="text-sm text-white/80 px-2">
                  {currentIndex + 1} / {items.length}
                </div>
              </div>
              
              {/* Navigation arrows */}
              <Button 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 rounded-full p-2 bg-black/40 hover:bg-black/60 text-white"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
              >
                <ChevronLeft className="h-6 w-6" />
                <span className="sr-only">Previous</span>
              </Button>
              
              <Button 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full p-2 bg-black/40 hover:bg-black/60 text-white"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
              >
                <ChevronRight className="h-6 w-6" />
                <span className="sr-only">Next</span>
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}