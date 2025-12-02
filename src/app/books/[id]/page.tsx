'use client';

import { useState } from 'react';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { books } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  MessageSquare,
  ShoppingCart,
  CalendarPlus,
  Heart,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/hooks/use-wishlist';
import { useCart } from '@/hooks/use-cart';

export default function BookDetailPage() {
  const params = useParams();
  const [purchaseType, setPurchaseType] = useState<'buy' | 'rent'>('buy');
  const { user } = useAuth();
  const { toast } = useToast();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist(user?.id);
  const { addToCart } = useCart(user?.id);

  const bookId = typeof params.id === 'string' ? params.id : '';
  const book = books.find((b) => b.id === bookId);
  if (!book) {
    notFound();
  }

  const isWishlisted = wishlist.some((item) => item.bookId === book.id);

  const handleWishlistToggle = () => {
    if (!user) {
        toast({
            variant: 'destructive',
            title: 'Please log in',
            description: 'You need to be logged in to manage your wishlist.',
        });
        return;
    }
    if (isWishlisted) {
      removeFromWishlist(book.id);
      toast({ title: 'Removed from wishlist!' });
    } else {
      addToWishlist(book.id);
      toast({ title: 'Added to wishlist!' });
    }
  };

  const handleAddToCart = () => {
    if (!user) {
        toast({
            variant: 'destructive',
            title: 'Please log in',
            description: 'You need to be logged in to add items to your cart.',
        });
        return;
    }
    addToCart(book.id, purchaseType);
    toast({
        title: 'Added to cart!',
        description: `${book.title} has been added to your cart.`,
    })
  };

  const mainImage = PlaceHolderImages.find((img) => img.id === book.imageIds[0]);
  const donorAvatar = PlaceHolderImages.find(
    (img) => img.id === book.donor.avatarImageId
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="sticky top-24">
          <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-xl">
            {mainImage && (
              <Image
                src={mainImage.imageUrl}
                alt={`Cover of ${book.title}`}
                data-ai-hint={mainImage.imageHint}
                fill
                className="object-cover"
              />
            )}
            <Button
              size="icon"
              className="absolute top-4 right-4 rounded-full"
              variant={isWishlisted ? 'destructive' : 'secondary'}
              onClick={handleWishlistToggle}
            >
              <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <Badge>{book.category}</Badge>
            <h1 className="text-4xl font-bold font-headline mt-2">{book.title}</h1>
            <p className="text-xl text-muted-foreground mt-1">by {book.author}</p>
          </div>

          <p className="text-lg leading-relaxed">{book.description}</p>

          <Separator />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold">Condition:</span>{' '}
              <Badge variant="secondary">{book.condition}</Badge>
            </div>
            <div>
              <span className="font-semibold">ISBN:</span>{' '}
              {book.id.padStart(13, '9780')}
            </div>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-12 w-12">
                {donorAvatar && (
                  <AvatarImage
                    src={donorAvatar.imageUrl}
                    alt={book.donor.name}
                    data-ai-hint={donorAvatar.imageHint}
                  />
                )}
                <AvatarFallback>{book.donor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-muted-foreground">Donated by</p>
                <p className="font-semibold">{book.donor.name}</p>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <Link href={user ? '/chat' : '/login'}>
                  <MessageSquare className="mr-2 h-4 w-4" /> Chat with{' '}
                  {book.donor.name}
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle className="font-headline">Get This Book</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className={`flex justify-between items-center p-4 border-2 rounded-lg cursor-pointer ${
                  purchaseType === 'buy' ? 'border-primary' : ''
                }`}
                onClick={() => setPurchaseType('buy')}
              >
                <div>
                  <h3 className="font-bold text-lg">Buy It</h3>
                  <p className="text-sm text-muted-foreground">Own it forever.</p>
                </div>
                <p className="text-3xl font-bold text-primary">
                  ₹{book.price.toFixed(2)}
                </p>
              </div>
              <div
                className={`flex justify-between items-center p-4 border-2 rounded-lg cursor-pointer ${
                  purchaseType === 'rent' ? 'border-primary' : ''
                }`}
                onClick={() => setPurchaseType('rent')}
              >
                <div>
                  <h3 className="font-bold text-lg">Rent It</h3>
                  <p className="text-sm text-muted-foreground">For 30 days.</p>
                </div>
                <p className="text-3xl font-bold text-primary">
                  ₹{book.rent.toFixed(2)}
                </p>
              </div>
              <Button size="lg" className="w-full" onClick={handleAddToCart}>
                {purchaseType === 'buy' ? (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart (Buy)
                  </>
                ) : (
                  <>
                    <CalendarPlus className="mr-2 h-5 w-5" /> Add to Cart (Rent)
                  </>
                )}
              </Button>
              <p className="text-xs text-center text-muted-foreground pt-2">
                Secure payments processed by Razorpay.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
