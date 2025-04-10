import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div 
            className="text-2xl font-bold text-primary hover:text-primary/90 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Portfolio
          </div>
          <Button onClick={() => navigate("/add")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </nav>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}