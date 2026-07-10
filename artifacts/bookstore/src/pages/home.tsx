import { useListFeaturedBooks, useGetBookStats } from "@workspace/api-client-react";
import { BookCard, BookCardSkeleton } from "@/components/book-card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, BookOpen, Library, LibraryBig, TrendingUp } from "lucide-react";

export function HomePage() {
  const { data: featuredBooks, isLoading: isFeaturedLoading } = useListFeaturedBooks();
  const { data: stats, isLoading: isStatsLoading } = useGetBookStats();

  return (
    <div className="flex flex-col min-h-[100dvh]">
      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground overflow-hidden">
        {/* Abstract decorative background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-secondary blur-3xl mix-blend-screen" />
          <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-background blur-3xl mix-blend-screen" />
        </div>
        
        <div className="container mx-auto px-4 md:px-6 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-sm text-primary-foreground backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-secondary mr-2"></span>
              Curated Independent Bookstore
            </div>
            
            <h1 className="font-serif text-5xl md:text-7xl font-medium tracking-tight leading-[1.1]">
              Find your next <br />
              <span className="text-secondary italic pr-4">great read.</span>
            </h1>
            
            <p className="text-primary-foreground/80 text-lg md:text-xl max-w-xl leading-relaxed">
              Step into our digital haven. Carefully selected fiction, non-fiction, and literary treasures waiting to be discovered.
            </p>
            
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link href="/books">
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 h-12 px-8 text-base">
                  Browse Catalog
                </Button>
              </Link>
              <Link href="/books?category=Fiction">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                  Explore Fiction
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Ribbon */}
      <section className="bg-card border-b border-border">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 divide-x divide-border">
            <div className="flex flex-col items-center justify-center text-center px-4 space-y-2">
              <LibraryBig className="h-6 w-6 text-secondary mb-1" />
              {isStatsLoading ? (
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              ) : (
                <span className="font-serif text-3xl font-medium">{stats?.totalBooks || 0}</span>
              )}
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Titles</span>
            </div>
            
            <div className="flex flex-col items-center justify-center text-center px-4 space-y-2">
              <Library className="h-6 w-6 text-secondary mb-1" />
              {isStatsLoading ? (
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              ) : (
                <span className="font-serif text-3xl font-medium">{stats?.totalCategories || 0}</span>
              )}
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Categories</span>
            </div>
            
            <div className="flex flex-col items-center justify-center text-center px-4 space-y-2">
              <BookOpen className="h-6 w-6 text-secondary mb-1" />
              {isStatsLoading ? (
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              ) : (
                <span className="font-serif text-3xl font-medium">${stats?.minPrice?.toFixed(0) || 0}+</span>
              )}
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Starting Price</span>
            </div>
            
            <div className="flex flex-col items-center justify-center text-center px-4 space-y-2">
              <TrendingUp className="h-6 w-6 text-secondary mb-1" />
              <span className="font-serif text-3xl font-medium">Daily</span>
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">New Arrivals</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-3">
              <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight">Staff Picks & Highlights</h2>
              <p className="text-muted-foreground max-w-2xl">
                Hand-selected titles we can't stop talking about. From gripping new fiction to essential classics.
              </p>
            </div>
            <Link href="/books">
              <Button variant="outline" className="gap-2">
                View All Books <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {isFeaturedLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <BookCardSkeleton key={i} />
              ))
            ) : featuredBooks?.length ? (
              featuredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed rounded-lg">
                No featured books available at the moment.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 md:py-28 bg-muted/30 border-t border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-block p-3 rounded-full bg-secondary/10 text-secondary mb-4">
              <BookOpen className="h-8 w-8" />
            </div>
            <h2 className="font-serif text-3xl md:text-5xl font-medium tracking-tight leading-tight">
              A sanctuary for those who <br className="hidden md:block"/>still love the smell of paper.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Book Haven isn't just a store; it's a curated experience. We believe in the power of a beautifully bound book to transport you to another world. Every title on our virtual shelves has been chosen with care.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
