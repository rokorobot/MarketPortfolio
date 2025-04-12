import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Layout } from "@/components/layout";
import { Loader2, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Author = {
  name: string;
  count: number;
};

export default function AuthorsPage() {
  const { toast } = useToast();
  
  const { data: authors, isLoading, error } = useQuery<Author[]>({
    queryKey: ["/api/authors"],
    onSuccess: (data) => {
      console.log("Authors loaded:", data);
    },
    onError: () => {
      toast({
        title: "Error fetching authors",
        description: "Failed to load authors. Please try again later.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <h2 className="text-xl font-bold mb-2">Failed to load authors</h2>
          <p className="text-muted-foreground">{(error as Error).message}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Authors</h1>
        
        {authors && authors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {authors.map((author) => (
              <Link key={author.name} href={`/items/author/${encodeURIComponent(author.name)}`}>
                <a className="block h-full">
                  <Card className="h-full hover:border-primary hover:shadow-md transition-all duration-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {author.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="outline" className="mt-2">
                        {author.count} {author.count === 1 ? "item" : "items"}
                      </Badge>
                    </CardContent>
                  </Card>
                </a>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No authors found.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}