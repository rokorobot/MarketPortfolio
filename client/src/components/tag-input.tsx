import React, { useState, useRef, useEffect } from "react";
import { X, Plus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  onRequestSuggestions?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function TagInput({
  value = [],
  onChange,
  suggestions = [],
  onRequestSuggestions,
  isLoading = false,
  disabled = false,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Focus the input when clicking on the container
  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (!trimmedTag) return;
    
    // Check if tag already exists
    if (value.includes(trimmedTag)) {
      toast({
        title: "Tag already exists",
        description: `"${trimmedTag}" is already in your tags.`,
        variant: "destructive",
      });
      return;
    }
    
    onChange([...value, trimmedTag]);
    setInputValue("");
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue) {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  const addSuggestion = (suggestion: string) => {
    addTag(suggestion);
  };

  return (
    <div className="space-y-2">
      <div
        className="flex flex-wrap gap-2 p-2 min-h-[100px] max-h-[200px] overflow-y-auto border rounded-md focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-ring focus-within:ring-offset-background"
        onClick={handleContainerClick}
      >
        {/* Display existing tags */}
        {value.map(tag => (
          <Badge key={tag} variant="secondary" className="text-sm flex items-center gap-1 py-1 px-3">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-muted-foreground hover:text-foreground rounded-full"
              disabled={disabled}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {tag}</span>
            </button>
          </Badge>
        ))}
        
        {/* Input field for new tags */}
        <div className="flex-1 min-w-[120px]">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-0 shadow-none focus-visible:ring-0 px-0 py-1 h-auto"
            placeholder="Add tag..."
            disabled={disabled}
          />
        </div>
      </div>
      
      {/* Tag suggestions section */}
      {suggestions.length > 0 && (
        <div className="bg-muted rounded-md p-2">
          <div className="text-sm text-muted-foreground mb-2">Suggestions:</div>
          <ScrollArea className="h-[80px]">
            <div className="flex flex-wrap gap-2">
              {suggestions.map(suggestion => (
                <Badge 
                  key={suggestion}
                  variant="outline"
                  className="cursor-pointer hover:bg-secondary"
                  onClick={() => addSuggestion(suggestion)}
                >
                  <Plus className="h-3 w-3 mr-1" /> {suggestion}
                </Badge>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
      
      {/* Button to generate suggestions if provided */}
      {onRequestSuggestions && (
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={onRequestSuggestions}
          disabled={isLoading || disabled}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating suggestions...
            </>
          ) : (
            <>Generate Tag Suggestions</>
          )}
        </Button>
      )}
    </div>
  );
}