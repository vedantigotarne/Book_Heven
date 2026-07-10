import { Link, useLocation } from "wouter";
import { useGetCurrentUser, useGetCart, getGetCurrentUserQueryKey, getGetCartQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { BookOpen, ShoppingBag, User as UserIcon, LogOut, Menu } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Header() {
  const [location] = useLocation();
  const { data: user, isLoading: isUserLoading, isError: isUserError } = useGetCurrentUser({
    query: {
      retry: false,
      queryKey: getGetCurrentUserQueryKey(),
    }
  });
  
  const isLoggedIn = !!user && !isUserError;
  
  const { data: cart } = useGetCart({
    query: {
      enabled: isLoggedIn,
      queryKey: getGetCartQueryKey(),
    }
  });

  const cartItemCount = cart?.itemCount || 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-6 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-sm">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="font-serif font-bold text-xl tracking-tight text-primary">Book Haven</span>
          </Link>
          
          <nav className="hidden md:flex gap-6">
            <Link 
              href="/books" 
              className={`text-sm font-medium transition-colors hover:text-primary ${location === '/books' ? 'text-primary' : 'text-muted-foreground'}`}
            >
              Browse Catalog
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/cart" className="relative group">
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary">
              <ShoppingBag className="h-5 w-5" />
              <span className="sr-only">Cart</span>
            </Button>
            {cartItemCount > 0 && (
              <Badge 
                variant="secondary" 
                className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 flex items-center justify-center text-[10px] pointer-events-none animate-in zoom-in"
              >
                {cartItemCount}
              </Badge>
            )}
          </Link>

          {!isUserLoading && (
            <div className="hidden sm:block">
              {isLoggedIn ? (
                <Link href="/account">
                  <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-primary">
                    <UserIcon className="h-4 w-4" />
                    <span>{user.username}</span>
                  </Button>
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link href="/register">
                    <Button>Register</Button>
                  </Link>
                </div>
              )}
            </div>
          )}

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-foreground text-background py-12 md:py-16 mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 opacity-90 hover:opacity-100 transition-opacity inline-flex">
              <div className="bg-background text-foreground p-1 rounded-sm">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="font-serif font-bold text-xl tracking-tight text-background">Book Haven</span>
            </Link>
            <p className="text-background/70 max-w-sm text-sm leading-relaxed">
              An independent online bookstore dedicated to curating the finest fiction, non-fiction, and literary treasures. 
              Beautifully bound, carefully selected.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-medium text-background">Explore</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><Link href="/books" className="hover:text-background transition-colors inline-block py-1">All Books</Link></li>
              <li><Link href="/books?category=Fiction" className="hover:text-background transition-colors inline-block py-1">Fiction</Link></li>
              <li><Link href="/books?category=Non-Fiction" className="hover:text-background transition-colors inline-block py-1">Non-Fiction</Link></li>
              <li><Link href="/books?category=Sci-Fi" className="hover:text-background transition-colors inline-block py-1">Sci-Fi & Fantasy</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-medium text-background">Account</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><Link href="/login" className="hover:text-background transition-colors inline-block py-1">Sign In</Link></li>
              <li><Link href="/register" className="hover:text-background transition-colors inline-block py-1">Register</Link></li>
              <li><Link href="/cart" className="hover:text-background transition-colors inline-block py-1">View Cart</Link></li>
              <li><Link href="/account" className="hover:text-background transition-colors inline-block py-1">Order History</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-background/50">
          <p>© {new Date().getFullYear()} Book Haven. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-background cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-background cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
