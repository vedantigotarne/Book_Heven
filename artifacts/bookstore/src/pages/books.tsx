import { useState } from "react";
import { useListBooks, useListCategories } from "@workspace/api-client-react";
import { BookCard, BookCardSkeleton } from "@/components/book-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useLocation } from "wouter";

export function BooksPage() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  
  // State from URL
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 0);
  
  // Queries
  const { data: categories } = useListCategories();
  const { data: bookPage, isLoading, isFetching } = useListBooks({
    search: search || undefined,
    category: category || undefined,
    page,
    size: 12,
  });

  // Handlers
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0); // Reset to first page on new search
    updateUrl();
  };

  const handleCategorySelect = (cat: string) => {
    setCategory(cat === category ? "" : cat);
    setPage(0);
    // Update URL on next tick to catch state change
    setTimeout(updateUrl, 0);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setTimeout(updateUrl, 0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setPage(0);
    setLocation("/books");
  };

  const updateUrl = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (page > 0) params.set("page", page.toString());
    setLocation(`/books${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-card border-b border-border py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-foreground mb-4">
            Catalog
          </h1>
          
          <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by title or author..." 
                className="pl-10 bg-background"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button type="submit" variant="secondary">Search</Button>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8 flex flex-col md:flex-row gap-8 flex-grow">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-medium flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </h2>
            {(search || category) && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2 text-xs text-muted-foreground">
                <X className="h-3 w-3 mr-1" /> Clear all
              </Button>
            )}
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories?.map((cat) => (
                <Badge 
                  key={cat} 
                  variant={category === cat ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => handleCategorySelect(cat)}
                >
                  {cat}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Active Filters Summary */}
          {(search || category) && (
            <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm mt-8 border border-border">
              <p className="font-medium text-foreground">Active Filters:</p>
              {search && <p className="text-muted-foreground"><span className="font-medium text-foreground">Search:</span> "{search}"</p>}
              {category && <p className="text-muted-foreground"><span className="font-medium text-foreground">Category:</span> {category}</p>}
              <p className="text-muted-foreground pt-2 border-t border-border mt-2">
                Showing {bookPage?.totalElements || 0} results
              </p>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-grow flex flex-col min-w-0">
          {/* Loading State */}
          {isLoading && !isFetching ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <BookCardSkeleton key={i} />
              ))}
            </div>
          ) : bookPage?.content.length === 0 ? (
            /* Empty State */
            <div className="flex-grow flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-border rounded-lg bg-muted/20">
              <div className="bg-muted p-4 rounded-full mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-serif text-2xl font-medium mb-2">No books found</h3>
              <p className="text-muted-foreground max-w-md mb-6">
                We couldn't find any books matching your current filters. Try adjusting your search term or category.
              </p>
              <Button onClick={clearFilters} variant="outline">Clear Filters</Button>
            </div>
          ) : (
            /* Results Grid */
            <>
              <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-opacity duration-200 ${isFetching ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
                {bookPage?.content.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>

              {/* Pagination */}
              {bookPage && bookPage.totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-4 py-4 border-t border-border">
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={bookPage.number === 0 || isFetching}
                    onClick={() => handlePageChange(bookPage.number - 1)}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                  </Button>
                  
                  <span className="text-sm font-medium text-muted-foreground">
                    Page {bookPage.number + 1} of {bookPage.totalPages}
                  </span>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={bookPage.number >= bookPage.totalPages - 1 || isFetching}
                    onClick={() => handlePageChange(bookPage.number + 1)}
                  >
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
