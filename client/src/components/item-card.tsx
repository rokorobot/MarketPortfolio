import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { type PortfolioItem } from "@shared/schema";
import { SiHiveBlockchain } from "react-icons/si";
import { Wallet } from "lucide-react";

export function ItemCard({ item }: { item: PortfolioItem }) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative aspect-[4/3]">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="object-cover w-full h-full hover:scale-105 transition-transform"
        />
      </div>
      <CardContent className="flex-1 p-4">
        <Link href={`/item/${item.id}`}>
          <a className="text-xl font-semibold hover:text-primary">{item.title}</a>
        </Link>
        <p className="text-muted-foreground mt-2">{item.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 gap-2">
        {item.objktUrl && (
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            asChild
          >
            <a href={item.objktUrl} target="_blank" rel="noopener noreferrer">
              <SiHiveBlockchain className="mr-2" />
              View
            </a>
          </Button>
        )}
        {item.openSeaUrl && (
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            asChild
          >
            <a href={item.openSeaUrl} target="_blank" rel="noopener noreferrer">
              <Wallet className="mr-2" />
              View
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}