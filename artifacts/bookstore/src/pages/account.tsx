import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { 
  useGetCurrentUser, 
  useLogout,
  useListOrders,
  useGetOrderStats,
  getGetCurrentUserQueryKey,
  getListOrdersQueryKey,
  getGetOrderStatsQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, Clock, DollarSign, LogOut, ChevronRight, User as UserIcon } from "lucide-react";
import { format } from "date-fns";

export function AccountPage() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: user, isLoading: isUserLoading, isError: isUserError } = useGetCurrentUser({
    query: { retry: false, queryKey: getGetCurrentUserQueryKey() }
  });

  const { data: orders, isLoading: isOrdersLoading } = useListOrders({
    query: { enabled: !!user && !isUserError, queryKey: getListOrdersQueryKey() }
  });

  const { data: stats, isLoading: isStatsLoading } = useGetOrderStats({
    query: { enabled: !!user && !isUserError, queryKey: getGetOrderStatsQueryKey() }
  });

  const logoutMutation = useLogout({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCurrentUserQueryKey() });
        queryClient.clear();
        setLocation("/login");
      }
    }
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!isUserLoading && isUserError) {
      setLocation("/login");
    }
  }, [isUserLoading, isUserError, setLocation]);

  if (isUserLoading || isUserError || !user) {
    return <div className="min-h-screen bg-background" />;
  }

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED': return 'default';
      case 'SHIPPED': return 'secondary';
      case 'PENDING': return 'outline';
      case 'CANCELLED': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background pb-20">
      {/* Account Header */}
      <div className="bg-primary text-primary-foreground py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-primary-foreground/10 border-2 border-primary-foreground/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <UserIcon className="h-10 w-10 text-primary-foreground/80" />
              </div>
              <div>
                <h1 className="font-serif text-3xl md:text-5xl font-medium tracking-tight mb-2">
                  {user.fullName || user.username}
                </h1>
                <p className="text-primary-foreground/80 flex items-center gap-2">
                  <span className="font-mono text-sm">{user.email}</span>
                  {user.role === 'ADMIN' && (
                    <Badge variant="outline" className="text-[10px] uppercase border-primary-foreground/30 text-primary-foreground ml-2">Admin</Badge>
                  )}
                </p>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-colors"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Stats Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="font-serif text-lg">Your Library</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-muted p-3 rounded-full text-secondary">
                    <Package className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Total Orders</p>
                    {isStatsLoading ? <Skeleton className="h-6 w-12 mt-1" /> : (
                      <p className="font-serif text-2xl">{stats?.totalOrders || 0}</p>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center gap-4">
                  <div className="bg-muted p-3 rounded-full text-secondary">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Total Spent</p>
                    {isStatsLoading ? <Skeleton className="h-6 w-20 mt-1" /> : (
                      <p className="font-mono text-xl">${stats?.totalSpent?.toFixed(2) || '0.00'}</p>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center gap-4">
                  <div className="bg-muted p-3 rounded-full text-secondary">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Pending Orders</p>
                    {isStatsLoading ? <Skeleton className="h-6 w-8 mt-1" /> : (
                      <p className="font-serif text-2xl">{stats?.pendingOrders || 0}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Orders List */}
          <div className="lg:col-span-3">
            <h2 className="font-serif text-2xl font-medium mb-6 flex items-center gap-2">
               Order History
            </h2>

            {isOrdersLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-24 w-full rounded-lg" />
                ))}
              </div>
            ) : !orders || orders.length === 0 ? (
              <div className="bg-card border border-border border-dashed rounded-xl p-12 text-center text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <h3 className="font-serif text-xl font-medium text-foreground mb-2">No orders yet</h3>
                <p className="max-w-sm mx-auto mb-6">You haven't placed any orders with us. Start building your library today.</p>
                <Link href="/books">
                  <Button variant="outline">Browse Catalog</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Link key={order.id} href={`/orders/${order.id}`}>
                    <Card className="hover:border-primary/50 transition-colors cursor-pointer group shadow-sm overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-sm text-muted-foreground">Order #{order.id.toString().padStart(6, '0')}</span>
                              <Badge variant={getStatusBadgeVariant(order.status)} className="text-[10px] px-2 py-0 h-5">
                                {order.status}
                              </Badge>
                            </div>
                            <p className="text-foreground font-medium">
                              {new Date(order.createdAt).toLocaleDateString('en-US', { 
                                year: 'numeric', month: 'long', day: 'numeric' 
                              })}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/3">
                            <div className="text-left sm:text-right">
                              <p className="text-sm text-muted-foreground mb-1">Total</p>
                              <p className="font-mono text-lg font-medium text-foreground">${order.total.toFixed(2)}</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors text-muted-foreground">
                              <ChevronRight className="h-5 w-5" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
