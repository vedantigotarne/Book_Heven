import { useGetCurrentUser, useGetCart, usePlaceOrder, getGetCurrentUserQueryKey, getListOrdersQueryKey, getGetCartQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { MapPin, ShieldCheck, CreditCard, ArrowLeft } from "lucide-react";
import { useEffect } from "react";

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  addressLine1: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(4, "ZIP code is required"),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

export function CheckoutPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user, isLoading: userLoading, isError: userError } = useGetCurrentUser({
    query: { retry: false, queryKey: getGetCurrentUserQueryKey() }
  });
  
  const { data: cart, isLoading: cartLoading } = useGetCart({
    query: { enabled: !!user && !userError, queryKey: getGetCartQueryKey() }
  });

  const placeOrder = usePlaceOrder({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
        toast({
          title: "Order placed successfully!",
          description: "Thank you for your purchase.",
        });
        setLocation("/account");
      },
      onError: () => {
        toast({
          title: "Order failed",
          description: "There was a problem placing your order. Please try again.",
          variant: "destructive",
        });
      }
    }
  });

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      addressLine1: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  // Prefill user data if available
  useEffect(() => {
    if (user?.fullName) {
      form.setValue("fullName", user.fullName);
    }
  }, [user, form]);

  // Auth redirect
  useEffect(() => {
    if (!userLoading && userError) {
      setLocation("/login");
    }
  }, [userLoading, userError, setLocation]);

  // Empty cart redirect
  useEffect(() => {
    if (!cartLoading && cart && cart.items.length === 0) {
      setLocation("/cart");
    }
  }, [cartLoading, cart, setLocation]);

  const onSubmit = (data: CheckoutValues) => {
    if (!cart || cart.items.length === 0) return;
    
    const shippingAddress = `${data.fullName}, ${data.addressLine1}, ${data.city}, ${data.state} ${data.zipCode}`;
    
    placeOrder.mutate({
      data: { shippingAddress }
    });
  };

  if (userLoading || cartLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return null; // Handled by useEffect redirect
  }

  return (
    <div className="min-h-[100dvh] bg-background">
      <div className="bg-card border-b border-border py-6">
        <div className="container mx-auto px-4 md:px-6">
          <Link href="/cart" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to cart
          </Link>
          <h1 className="font-serif text-3xl font-medium tracking-tight text-foreground mt-4">Checkout</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Checkout Form */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            <Card className="border-border/60 shadow-sm overflow-hidden">
              <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center gap-3">
                <MapPin className="h-5 w-5 text-secondary" />
                <h2 className="font-serif text-xl font-medium text-foreground">Shipping Address</h2>
              </div>
              <CardContent className="p-6">
                <Form {...form}>
                  <form id="checkout-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="addressLine1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem className="md:col-span-1">
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="New York" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem className="md:col-span-1">
                            <FormLabel>State / Province</FormLabel>
                            <FormControl>
                              <Input placeholder="NY" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem className="md:col-span-1">
                            <FormLabel>ZIP / Postal Code</FormLabel>
                            <FormControl>
                              <Input placeholder="10001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-sm overflow-hidden">
              <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-secondary" />
                <h2 className="font-serif text-xl font-medium text-foreground">Payment Method</h2>
              </div>
              <CardContent className="p-8 text-center text-muted-foreground border-2 border-dashed border-border m-6 rounded-lg bg-background">
                <p>This is a demo application. No payment is required.</p>
                <p className="text-sm mt-2">Clicking "Place Order" will successfully complete the transaction.</p>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-24 space-y-6">
              <Card className="border-border shadow-sm">
                <CardHeader className="bg-muted/20 border-b border-border pb-4">
                  <CardTitle className="font-serif text-xl font-medium">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-[40vh] overflow-y-auto p-6 space-y-4">
                    {cart.items.map((item) => (
                      <div key={item.id} className="flex gap-4 items-start">
                        <div className="w-16 h-24 bg-muted shrink-0 rounded overflow-hidden border border-border">
                          {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-grow min-w-0">
                          <h4 className="text-sm font-medium leading-tight mb-1 truncate text-foreground">{item.title}</h4>
                          <p className="text-xs text-muted-foreground mb-2">{item.author}</p>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Qty: {item.quantity}</span>
                            <span className="font-mono font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div className="p-6 space-y-3 text-sm bg-muted/10">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span className="font-mono text-foreground">${cart.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span className="font-mono text-foreground">$0.00</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Tax</span>
                      <span className="font-mono text-foreground">$0.00</span>
                    </div>
                    
                    <Separator className="my-2" />
                    
                    <div className="flex justify-between items-center py-2">
                      <span className="font-medium text-base text-foreground">Total</span>
                      <span className="font-mono text-2xl font-medium text-foreground">${cart.total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-card border border-border rounded-xl p-4 shadow-sm text-sm text-muted-foreground flex gap-3 items-start">
                <ShieldCheck className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <p>Secure checkout. Your data is protected by industry-standard encryption.</p>
              </div>

              <Button 
                type="submit" 
                form="checkout-form" 
                size="lg" 
                className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 text-lg font-medium shadow-md transition-all hover:-translate-y-0.5"
                disabled={placeOrder.isPending}
              >
                {placeOrder.isPending ? "Processing..." : `Place Order — $${cart.total.toFixed(2)}`}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
