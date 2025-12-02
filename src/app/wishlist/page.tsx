'use client';

import Link from 'next/link';
import { useWishlist } from '@/hooks/use-wishlist';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { BookCard } from '@/components/book-card';
import { books } from '@/lib/data';
import { AlertTriangle, Heart } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function WishlistPage() {
  const { user } = useAuth();
  const { wishlist, removeFromWishlist } = useWishlist(user?.id);

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
            <div className="container mx-auto px-4 py-12 text-center">
                <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground" />
                <h2 className="mt-4 text-2xl font-bold">Please Sign In</h2>
                <p className="mt-2 text-muted-foreground">You need to be logged in to view your wishlist.</p>
                <Button asChild className="mt-6">
                <Link href="/login">Sign In</Link>
                </Button>
            </div>
        </main>
        <Footer />
      </div>
    );
  }

  const wishlistedBooks = books.filter(book => wishlist.some(item => item.bookId === book.id));

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold font-headline mb-8">Your Wishlist</h1>
          {wishlistedBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {wishlistedBooks.map((book) => (
                <div key={book.id} className="relative group">
                  <BookCard book={book} />
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeFromWishlist(book.id)}
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
                <h2 className="mt-4 text-2xl font-bold">Your Wishlist is Empty</h2>
                <p className="mt-2 text-muted-foreground">Add books you love to your wishlist.</p>
                <Button asChild className="mt-6">
                    <Link href="/">Browse Books</Link>
                </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
