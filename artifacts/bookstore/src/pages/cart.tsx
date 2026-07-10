import { useGetCart, useUpdateCartItem, useRemoveCartItem, getGetCartQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export function CartPage() {
  const { data: cart, isLoading } = useGetCart();
  const queryClient = useQueryClient();

  const updateItem = useUpdateCartItem({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() })
    }
  });

  const removeItem = useRemoveCartItem({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() })
    }
  });

  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateItem.mutate({ itemId, data: { quantity: newQuantity } });
  };

  const handleRemove = (itemId: number) => {
    removeItem.mutate({ itemId });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl min-h-screen">
        <h1 className="font-serif text-3xl font-medium mb-8">Your Cart</h1>
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg border border-border"></div>
          ))}
        </div>
      </div>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <div className="min-h-[100dvh] bg-background">
      <div className="bg-card border-b border-border py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-foreground">
            Your Cart
          </h1>
          {!isEmpty && (
            <p className="text-muted-foreground mt-2">{cart.itemCount} item{cart.itemCount !== 1 ? 's' : ''}</p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8 max-w-5xl">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border rounded-xl bg-card">
            <div className="bg-muted p-6 rounded-full mb-6 text-muted-foreground">
              <ShoppingBag className="h-12 w-12" />
            </div>
            <h2 className="font-serif text-2xl font-medium mb-3 text-foreground">Your cart is empty</h2>
            <p className="text-muted-foreground max-w-md mb-8">
              Looks like you haven't added any books to your cart yet. Discover your next great read in our catalog.
            </p>
            <Link href="/books">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8">
                Browse Books
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <Card key={item.id} className="overflow-hidden border-border/60 shadow-sm hover-elevate transition-all">
                  <CardContent className="p-0 flex sm:flex-row flex-col">
                    {/* Item Image */}
                    <Link href={`/books/${item.bookId}`} className="shrink-0">
                      <div className="w-full sm:w-32 aspect-[2/3] sm:aspect-[3/4] bg-muted flex items-center justify-center border-b sm:border-b-0 sm:border-r border-border">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-xs text-muted-foreground font-serif p-4 text-center">No Cover</div>
                        )}
                      </div>
                    </Link>
                    
                    {/* Item Details */}
                    <div className="flex flex-col flex-grow p-4 sm:p-6 justify-between gap-4">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <Link href={`/books/${item.bookId}`}>
                            <h3 className="font-serif text-lg font-medium text-foreground hover:text-primary transition-colors leading-tight mb-1">
                              {item.title}
                            </h3>
                          </Link>
                          <p className="text-sm text-muted-foreground font-medium">{item.author}</p>
                        </div>
                        <div className="font-mono font-medium text-lg shrink-0">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-border rounded bg-muted/30">
                          <button 
                            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || updateItem.isPending}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-mono font-medium">
                            {item.quantity}
                          </span>
                          <button 
                            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            disabled={updateItem.isPending}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 px-2 h-8"
                          onClick={() => handleRemove(item.id)}
                          disabled={removeItem.isPending}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card border border-border rounded-xl p-6 shadow-sm">
                <h3 className="font-serif text-xl font-medium mb-6 text-foreground">Order Summary</h3>
                
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal ({cart.itemCount} items)</span>
                    <span className="font-mono text-foreground">${cart.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-foreground">Calculated at checkout</span>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between items-end">
                    <span className="font-medium text-base text-foreground">Estimated Total</span>
                    <span className="font-mono text-2xl font-medium text-foreground">${cart.total.toFixed(2)}</span>
                  </div>
                </div>

                <Link href="/checkout" className="block mt-8">
                  <Button size="lg" className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 text-base">
                    Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                
                <div className="mt-4 text-center">
                  <Link href="/books" className="text-sm text-muted-foreground hover:text-primary transition-colors underline underline-offset-4">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
