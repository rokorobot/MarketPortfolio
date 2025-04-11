import { createContext, useContext, useState, ReactNode } from "react";
import { PortfolioItem } from "@shared/schema";
import { Showcase } from "@/components/showcase";

interface ShowcaseContextType {
  startShowcase: (items: PortfolioItem[]) => void;
  isShowcasing: boolean;
}

const ShowcaseContext = createContext<ShowcaseContextType | undefined>(undefined);

export function ShowcaseProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showcaseItems, setShowcaseItems] = useState<PortfolioItem[]>([]);
  
  const startShowcase = (items: PortfolioItem[]) => {
    if (items.length === 0) return;
    setShowcaseItems(items);
    setIsOpen(true);
  };
  
  const closeShowcase = () => {
    setIsOpen(false);
  };
  
  return (
    <ShowcaseContext.Provider value={{ startShowcase, isShowcasing: isOpen }}>
      {children}
      <Showcase
        items={showcaseItems}
        isOpen={isOpen}
        onClose={closeShowcase}
      />
    </ShowcaseContext.Provider>
  );
}

export function useShowcase() {
  const context = useContext(ShowcaseContext);
  if (context === undefined) {
    throw new Error("useShowcase must be used within a ShowcaseProvider");
  }
  return context;
}