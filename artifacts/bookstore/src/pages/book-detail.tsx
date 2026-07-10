import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { 
  useGetBook, 
  useAddToCart, 
  useGetCurrentUser,
  getGetCurrentUserQueryKey,
  getGetCartQueryKey 
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ShoppingCart, Minus, Plus, Check } from "lucide-react";
import { Link } from "wouter";

export function BookDetailPage() {
  const [, params] = useRoute("/books/:id");
  const id = Number(params?.id);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Queries
  const { data: user } = useGetCurrentUser({ query: { retry: false, queryKey: getGetCurrentUserQueryKey() } });
  const { data: book, isLoading, isError } = useGetBook(id, { 
    query: { 
      enabled: !!id,
      queryKey: ["book", id] 
    } 
  });

  // Mutations
  const addToCart = useAddToCart({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
        setIsAdded(true);
        toast({
          title: "Added to cart",
          description: `${quantity} × ${book?.title} added to your cart.`,
        });
        setTimeout(() => setIsAdded(false), 2000);
      },
      onError: (error) => {
        if (error.status === 401) {
          toast({
            title: "Authentication required",
            description: "Please log in to add items to your cart.",
            variant: "destructive",
          });
          setLocation("/login");
        } else {
          toast({
            title: "Error",
            description: "Failed to add item to cart. Please try again.",
            variant: "destructive",
          });
        }
      }
    }
  });

  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need an account to add items to your cart.",
      });
      setLocation("/login");
      return;
    }

    addToCart.mutate({
      data: {
        bookId: id,
        quantity,
      }
    });
  };

  const increaseQuantity = () => {
    if (book && quantity < book.stock) {
      setQuantity(q => q + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-3xl mb-4 text-foreground">Book Not Found</h2>
        <p className="text-muted-foreground mb-8">The book you're looking for doesn't exist or has been removed.</p>
        <Link href="/books">
          <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Catalog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-card border-b border-border py-4">
        <div className="container mx-auto px-4 md:px-6">
          <Link href="/books" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to browse
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div className="aspect-[2/3] w-full max-w-md mx-auto md:mx-0">
              <Skeleton className="w-full h-full rounded-lg" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-8 w-32" />
              <div className="space-y-2 pt-6">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </div>
        ) : book ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left Column: Image */}
            <div className="relative group mx-auto md:mx-0 w-full max-w-md">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative aspect-[2/3] w-full bg-muted/20 border-2 border-border/50 rounded-lg overflow-hidden shadow-xl flex items-center justify-center">
                {book.imageUrl ? (
                  <img 
                    src={book.imageUrl} 
                    alt={`Cover of ${book.title}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="p-8 text-center flex flex-col items-center justify-center h-full w-full bg-primary/5">
                    <span className="font-serif text-2xl text-primary/40 italic leading-snug">{book.title}</span>
                    <span className="text-primary/30 mt-4 text-sm uppercase tracking-widest">{book.author}</span>
                  </div>
                )}
                {book.featured && (
                  <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground pointer-events-none px-3 py-1 text-sm">
                    Staff Pick
                  </Badge>
                )}
              </div>
            </div>

            {/* Right Column: Details */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="outline" className="uppercase tracking-widest px-3 py-1 font-semibold text-xs border-primary/20 text-primary">
                  {book.category}
                </Badge>
                
                <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight text-foreground leading-[1.1]">
                  {book.title}
                </h1>
                
                <p className="text-xl text-muted-foreground font-medium">
                  By <span className="text-foreground">{book.author}</span>
                </p>
              </div>

              <div className="flex items-end gap-4">
                <span className="font-mono text-4xl font-medium text-foreground">
                  ${book.price.toFixed(2)}
                </span>
                <span className={`text-sm mb-2 font-medium ${book.stock > 0 ? 'text-secondary' : 'text-destructive'}`}>
                  {book.stock > 0 ? `${book.stock} copies available` : 'Out of stock'}
                </span>
              </div>

              <Separator className="bg-border/60" />

              <div className="prose prose-sm md:prose-base dark:prose-invert prose-p:leading-relaxed max-w-none text-foreground/80 font-serif">
                {book.description ? (
                  <p>{book.description}</p>
                ) : (
                  <p className="italic text-muted-foreground">No description available for this title.</p>
                )}
              </div>

              <div className="pt-6 bg-card border border-border p-6 rounded-lg shadow-sm space-y-6">
                {book.stock > 0 ? (
                  <>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-foreground">Quantity</span>
                      <div className="flex items-center border border-border rounded-md bg-background">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={decreaseQuantity}
                          disabled={quantity <= 1}
                          className="h-10 w-10 rounded-none rounded-l-md hover:bg-muted"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <div className="w-12 text-center font-mono font-medium text-sm">
                          {quantity}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={increaseQuantity}
                          disabled={quantity >= book.stock}
                          className="h-10 w-10 rounded-none rounded-r-md hover:bg-muted"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <Button 
                      size="lg" 
                      className={`w-full h-14 text-base transition-all duration-300 ${isAdded ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-secondary text-secondary-foreground hover:bg-secondary/90'}`}
                      onClick={handleAddToCart}
                      disabled={addToCart.isPending || isAdded}
                    >
                      {addToCart.isPending ? (
                        <div className="h-5 w-5 border-2 border-secondary-foreground border-t-transparent rounded-full animate-spin"></div>
                      ) : isAdded ? (
                        <>
                          <Check className="mr-2 h-5 w-5" /> Added to Cart
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart — ${(book.price * quantity).toFixed(2)}
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <Button size="lg" disabled className="w-full h-14 text-base">
                    Out of Stock
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
