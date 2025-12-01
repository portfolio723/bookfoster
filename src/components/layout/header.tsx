import Link from "next/link";
import { BookOpen, LogIn, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="bg-background/95 sticky top-0 z-50 border-b backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold font-headline">
              BookExchange
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/"
              className="transition-colors hover:text-primary"
            >
              Browse
            </Link>
            <Link
              href="/donate"
              className="transition-colors hover:text-primary"
            >
              Donate a Book
            </Link>
            <Link
              href="/chat"
              className="transition-colors hover:text-primary"
            >
              Messages
            </Link>
          </nav>

          <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" asChild>
                <Link href="/wishlist">
                    <Heart />
                    <span className="sr-only">Wishlist</span>
                </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
                <Link href="/cart">
                    <ShoppingCart />
                    <span className="sr-only">Cart</span>
                </Link>
            </Button>
            <Button asChild>
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
