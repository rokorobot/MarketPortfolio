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
  const [timer, setTimer] = useState<number | null>(null);
  const [showControls, setShowControls] = useState(false);
  const [showMetadata, setShowMetadata] = useState(true); // New state for toggling metadata visibility
  const [slideInterval, setSlideInterval] = useState(8000); // Default 8 seconds
  
  // Make sure we have valid items and currentIndex is within bounds
  const hasItems = Array.isArray(items) && items.length > 0;
  const safeCurrentIndex = hasItems ? Math.min(currentIndex, items.length - 1) : 0;
  const currentItem = hasItems ? items[safeCurrentIndex] : null;
  
  // Fetch showcase interval from site settings
  useEffect(() => {
    const fetchShowcaseInterval = async () => {
      try {
        const response = await fetch('/api/site-settings');
        if (response.ok) {
          const settings = await response.json();
          if (settings.showcase_interval) {
            const intervalValue = parseInt(settings.showcase_interval);
            console.log('Showcase: Loading interval from settings:', intervalValue, 'ms');
            setSlideInterval(intervalValue);
          }
        }
      } catch (error) {
        console.error('Error fetching showcase interval:', error);
      }
    };
    
    fetchShowcaseInterval();
  }, []);
  
  // Listen for showcase interval changes
  useEffect(() => {
    const handleIntervalChange = (e: CustomEvent) => {
      if (e.detail && e.detail.interval) {
        console.log('Showcase: received interval change event with value:', e.detail.interval, 'ms');
        setSlideInterval(e.detail.interval);
      }
    };
    
    document.addEventListener('showcase-interval-changed', handleIntervalChange as EventListener);
    
    return () => {
      document.removeEventListener('showcase-interval-changed', handleIntervalChange as EventListener);
    };
  }, []);
  
  // Handle autoplay timer
  useEffect(() => {
    console.log('Showcase: autoplay effect triggered', { 
      isAutoplay, 
      isOpen, 
      slideInterval,
      itemsCount: Array.isArray(items) ? items.length : 0,
      currentIndex
    });
    
    // Only create a timer if we have valid items
    if (isAutoplay && isOpen && hasItems) {
      console.log('Showcase: starting autoplay timer with interval', slideInterval, 'ms');
      
      // Clean up any existing timer
      if (timer) {
        console.log('Showcase: clearing existing timer');
        window.clearInterval(timer);
      }
      
      // Create new timer
      const newTimer = window.setInterval(() => {
        console.log('Showcase: advancing to next item');
        setCurrentIndex(prev => {
          const nextIndex = (prev + 1) % items.length;
          console.log(`Showcase: moving from item ${prev} to ${nextIndex}`);
          return nextIndex;
        });
      }, slideInterval);
      
      console.log('Showcase: new timer created with ID:', newTimer);
      setTimer(newTimer);
      
      return () => {
        console.log('Showcase: cleaning up timer on unmount/dependency change:', newTimer);
        window.clearInterval(newTimer);
      };
    } else if (timer) {
      console.log('Showcase: autoplay disabled, dialog closed, or no items - clearing timer:', timer);
      window.clearInterval(timer);
      setTimer(null);
    }
    
    return () => {
      if (timer) {
        console.log('Showcase: cleaning up timer in final cleanup:', timer);
        window.clearInterval(timer);
      }
    };
  }, [isAutoplay, isOpen, hasItems, items, slideInterval]);
  
  // Reset state when dialog is closed
  useEffect(() => {
    if (!isOpen) {
      setCurrentIndex(0);
      setIsAutoplay(true);
      if (timer) {
        window.clearInterval(timer);
        setTimer(null);
      }
    }
  }, [isOpen, timer]);
  
  // Go to previous item
  const handlePrevious = () => {
    if (!hasItems) return;
    setCurrentIndex(prev => (prev - 1 + items.length) % items.length);
    setIsAutoplay(false);
  };
  
  // Go to next item
  const handleNext = () => {
    if (!hasItems) return;
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
  
  // Toggle metadata visibility
  const toggleMetadata = () => {
    setShowMetadata(prev => !prev);
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
      } else if (e.key === 'Control') {
        toggleMetadata();
        e.preventDefault(); // Prevent default behavior
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
      <DialogContent className="w-screen h-screen max-w-none max-h-none p-0 bg-black text-white overflow-hidden border-none rounded-none">
        <VisuallyHidden>
          <DialogTitle>Portfolio Showcase - {currentItem.title}</DialogTitle>
        </VisuallyHidden>
        <div 
          className="relative w-full h-full flex flex-col items-center justify-center"
          onClick={toggleControls}
        >
          {/* Full screen image with title overlay */}
          <div className="absolute inset-0 w-full h-full">
            <img 
              src={currentItem.imageUrl} 
              alt={currentItem.title}
              className="w-full h-full object-contain"
            />
          </div>
          
          {/* Controls at bottom - always visible */}
          <div className="absolute bottom-4 left-0 right-0 z-10">
            <div className="flex flex-col items-center">
              {/* Title and author metadata - conditionally visible, positioned ABOVE controls */}
              <div 
                className={`mb-3 transition-opacity duration-300 ${
                  showMetadata ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-1 text-white drop-shadow-md">{currentItem.title}</h2>
                  {currentItem.author && (
                    <p className="text-md text-gray-200 drop-shadow-md">
                      By {currentItem.author}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Navigation controls */}
              <div className="flex justify-center items-center gap-2">
                <Button 
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-black/30 rounded-full h-8 w-8 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevious();
                  }}
                >
                  <ChevronLeft className="h-5 w-5" />
                  <span className="sr-only">Previous</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-black/30 rounded-full h-8 w-8 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAutoplay();
                  }}
                >
                  {isAutoplay ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                  <span className="sr-only">{isAutoplay ? 'Pause' : 'Play'}</span>
                </Button>
                
                <Button 
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-black/30 rounded-full h-8 w-8 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                >
                  <ChevronRight className="h-5 w-5" />
                  <span className="sr-only">Next</span>
                </Button>
                
                <span className="text-xs text-white px-2 drop-shadow-sm">
                  {currentIndex + 1}/{items.length}
                </span>
              </div>
            </div>
          </div>
          
          {/* Background gradient for bottom area - only visible with metadata */}
          <div 
            className={`absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-300 ${
              showMetadata ? 'opacity-100' : 'opacity-0'
            }`}
          ></div>
          
          {/* Simplified Controls overlay - toggle visibility */}
          {showControls && (
            <>
              {/* Close button in the corner */}
              <DialogClose className="absolute top-4 right-4 z-10">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="text-white hover:bg-black/30"
                >
                  <X className="h-6 w-6" />
                  <span className="sr-only">Close</span>
                </Button>
              </DialogClose>
              
              {/* Navigation arrows */}
              <Button 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 rounded-full p-2 bg-black/40 hover:bg-black/60 text-white h-10 w-10"
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
                className="absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full p-2 bg-black/40 hover:bg-black/60 text-white h-10 w-10"
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