import { useEffect } from "react";
import { useRoute, useLocation, Link } from "wouter";
import { useGetOrder, useGetCurrentUser, getGetCurrentUserQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Package, MapPin, Calendar, CreditCard } from "lucide-react";
import { format } from "date-fns";

export function OrderDetailPage() {
  const [, params] = useRoute("/orders/:id");
  const id = Number(params?.id);
  const [, setLocation] = useLocation();

  const { data: user, isLoading: isUserLoading, isError: isUserError } = useGetCurrentUser({
    query: { retry: false, queryKey: getGetCurrentUserQueryKey() }
  });

  const { data: order, isLoading, isError } = useGetOrder(id, {
    query: { 
      enabled: !!id && !!user && !isUserError,
      queryKey: ["order", id]
    }
  });

  // Auth redirect
  useEffect(() => {
    if (!isUserLoading && isUserError) {
      setLocation("/login");
    }
  }, [isUserLoading, isUserError, setLocation]);

  if (isUserLoading) return <div className="min-h-screen bg-background" />;

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'DELIVERED': return 'default';
      case 'SHIPPED': return 'secondary';
      case 'PENDING': return 'outline';
      case 'CANCELLED': return 'destructive';
      default: return 'outline';
    }
  };

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-3xl mb-4 text-foreground">Order Not Found</h2>
        <p className="text-muted-foreground mb-8">We couldn't find the order you're looking for.</p>
        <Link href="/account">
          <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Account</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background pb-20">
      <div className="bg-card border-b border-border py-4">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <Link href="/account" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to account
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-5xl">
        {isLoading ? (
          <div className="space-y-8">
            <Skeleton className="h-12 w-64" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-4">
                <Skeleton className="h-64 w-full" />
              </div>
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        ) : order ? (
          <>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-foreground mb-2">
                  Order #{order.id.toString().padStart(6, '0')}
                </h1>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(order.createdAt).toLocaleDateString('en-US', { 
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              </div>
              <Badge variant={getStatusBadgeVariant(order.status)} className="text-sm px-3 py-1 self-start sm:self-auto uppercase tracking-wider">
                {order.status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Order Items */}
              <div className="lg:col-span-2">
                <Card className="border-border shadow-sm">
                  <CardHeader className="bg-muted/30 border-b border-border">
                    <CardTitle className="font-serif text-xl font-medium flex items-center gap-2">
                      <Package className="h-5 w-5 text-secondary" /> Items Ordered
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-border">
                      {order.items?.map((item) => (
                        <div key={item.id} className="p-6 flex gap-6 items-start">
                          <div className="w-16 h-24 sm:w-20 sm:h-32 bg-muted shrink-0 rounded border border-border flex items-center justify-center">
                            {/* Assuming no images on order items per schema, show placeholder */}
                            <span className="font-serif text-xs text-muted-foreground px-2 text-center">Book Cover</span>
                          </div>
                          <div className="flex-grow">
                            <Link href={`/books/${item.bookId}`}>
                              <h3 className="font-serif text-lg font-medium text-foreground hover:text-primary transition-colors leading-tight mb-1">
                                {item.title}
                              </h3>
                            </Link>
                            <p className="text-sm text-muted-foreground mb-4">{item.author}</p>
                            
                            <div className="flex justify-between items-center text-sm font-medium">
                              <span className="text-muted-foreground">Qty: {item.quantity}</span>
                              <span className="font-mono text-base text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary & Details */}
              <div className="space-y-6">
                <Card className="border-border shadow-sm">
                  <CardHeader className="bg-muted/30 border-b border-border pb-4">
                    <CardTitle className="font-serif text-lg font-medium flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-secondary" /> Payment Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-3 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span className="font-mono text-foreground">${order.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span className="font-mono text-foreground">$0.00</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-medium text-base text-foreground">Total Paid</span>
                      <span className="font-mono text-2xl font-medium text-foreground">${order.total.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border shadow-sm">
                  <CardHeader className="bg-muted/30 border-b border-border pb-4">
                    <CardTitle className="font-serif text-lg font-medium flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-secondary" /> Shipping Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                      {order.shippingAddress ? (
                         order.shippingAddress.split(',').map((line, i) => (
                           <div key={i}>{line.trim()}</div>
                         ))
                      ) : (
                        <span className="text-muted-foreground italic">No shipping address provided.</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
