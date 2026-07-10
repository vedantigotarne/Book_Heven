import { Book } from "@workspace/api-client-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export function BookCard({ book }: { book: Book }) {
  return (
    <Card className="group relative overflow-hidden flex flex-col h-full hover-elevate transition-all duration-300 border-border">
      <Link href={`/books/${book.id}`} className="absolute inset-0 z-10">
        <span className="sr-only">View {book.title}</span>
      </Link>
      
      {/* Gold Ribbon / Bookmark hover effect */}
      <div className="absolute top-0 right-6 w-8 h-0 bg-secondary transition-all duration-300 ease-out group-hover:h-12 z-0" 
           style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% calc(100% - 8px), 0 100%)' }} />

      <CardContent className="p-0 flex-grow bg-muted/20 relative">
        <div className="aspect-[2/3] w-full flex items-center justify-center p-6 bg-muted/40 relative">
          {book.imageUrl ? (
            <img 
              src={book.imageUrl} 
              alt={`Cover of ${book.title}`}
              className="w-full h-full object-cover rounded shadow-md group-hover:shadow-xl transition-shadow duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-primary/10 border-2 border-primary/20 border-dashed rounded flex items-center justify-center text-center p-4">
               <span className="font-serif text-primary/60 italic leading-tight">{book.title}</span>
            </div>
          )}
          {book.featured && (
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground pointer-events-none rounded-sm">Featured</Badge>
          )}
        </div>
        
        <div className="p-5 flex flex-col gap-2">
          <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            {book.category}
          </div>
          <h3 className="font-serif text-lg font-medium leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
            {book.title}
          </h3>
          <p className="text-muted-foreground text-sm font-medium">
            {book.author}
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-0 border-t border-border/50 mt-auto bg-card flex justify-between items-center relative z-20">
        <span className="font-mono font-medium text-lg">${book.price.toFixed(2)}</span>
        <span className="text-xs text-muted-foreground">
           {book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'}
        </span>
      </CardFooter>
    </Card>
  );
}

export function BookCardSkeleton() {
  return (
    <Card className="overflow-hidden flex flex-col h-full border-border">
      <CardContent className="p-0 flex-grow">
        <div className="aspect-[2/3] w-full bg-muted/40 p-6 flex items-center justify-center">
           <div className="w-full h-full bg-muted rounded"></div>
        </div>
        <div className="p-5 flex flex-col gap-3">
          <div className="h-3 w-16 bg-muted rounded"></div>
          <div className="h-5 w-full bg-muted rounded"></div>
          <div className="h-4 w-2/3 bg-muted rounded"></div>
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-0 mt-auto border-t border-border/50 bg-card flex justify-between items-center">
        <div className="h-6 w-16 bg-muted rounded"></div>
        <div className="h-3 w-20 bg-muted rounded"></div>
      </CardFooter>
    </Card>
  );
}
