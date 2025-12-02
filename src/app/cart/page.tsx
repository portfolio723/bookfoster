'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, MinusCircle, PlusCircle, ShoppingCart } from 'lucide-react';
import { books } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function CartPage() {
  const { user } = useAuth();
  const { cartItems, updateItem, removeItem, clearCart } = useCart(user?.id);

  const getBookDetails = (bookId: string) => {
    return books.find((book) => book.id === bookId);
  };

  const total = cartItems.reduce((acc, item) => {
    const book = getBookDetails(item.bookId);
    if (!book) return acc;
    const price = item.type === 'buy' ? book.price : book.rent;
    return acc + price * item.quantity;
  }, 0);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-2xl font-bold">Please Sign In</h2>
        <p className="mt-2 text-muted-foreground">You need to be logged in to view your cart.</p>
        <Button asChild className="mt-6">
          <Link href="/login">Sign In</Link>
        </Button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-2xl font-bold">Your Cart is Empty</h2>
        <p className="mt-2 text-muted-foreground">Looks like you haven't added any books yet.</p>
        <Button asChild className="mt-6">
          <Link href="/">Browse Books</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold font-headline mb-8">Your Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const book = getBookDetails(item.bookId);
            if (!book) return null;
            const image = PlaceHolderImages.find((img) => img.id === book.imageIds[0]);
            const price = item.type === 'buy' ? book.price : book.rent;

            return (
              <Card key={item.id} className="flex items-center p-4">
                <div className="relative h-24 w-16 mr-4 rounded-md overflow-hidden">
                    {image && <Image src={image.imageUrl} alt={book.title} data-ai-hint={image.imageHint} fill className="object-cover" />}
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold">{book.title}</h3>
                  <p className="text-sm text-muted-foreground">{book.author}</p>
                  <p className="text-sm font-bold text-primary mt-1 capitalize">{item.type}</p>
                </div>
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-2">
                     <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateItem(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                        <MinusCircle className="h-4 w-4" />
                     </Button>
                     <span>{item.quantity}</span>
                     <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateItem(item.id, item.quantity + 1)}>
                        <PlusCircle className="h-4 w-4" />
                     </Button>
                   </div>
                  <p className="w-20 text-right font-semibold">₹{(price * item.quantity).toFixed(2)}</p>
                  <Button variant="outline" size="sm" onClick={() => removeItem(item.id)}>Remove</Button>
                </div>
              </Card>
            );
          })}
        </div>
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹50.00</span>
              </div>
               <div className="flex justify-between">
                <span>Security Deposit (for rentals)</span>
                <span>₹{cartItems.filter(i => i.type === 'rent').reduce((acc, item) => {
                    const book = getBookDetails(item.bookId);
                    return acc + (book ? (book.price / 4) * item.quantity : 0);
                }, 0).toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{(total + 50 + cartItems.filter(i => i.type === 'rent').reduce((acc, item) => {
                    const book = getBookDetails(item.bookId);
                    return acc + (book ? (book.price / 4) * item.quantity : 0);
                }, 0)).toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button size="lg" className="w-full">Proceed to Checkout</Button>
              <Button variant="outline" className="w-full" onClick={clearCart}>Clear Cart</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
