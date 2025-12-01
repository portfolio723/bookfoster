import Image from "next/image";
import { notFound } from "next/navigation";
import { books } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, ShoppingCart, CalendarPlus } from "lucide-react";

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const book = books.find((b) => b.id === params.id);
  if (!book) {
    notFound();
  }

  const mainImage = PlaceHolderImages.find((img) => img.id === book.imageIds[0]);
  const donorAvatar = PlaceHolderImages.find((img) => img.id === book.donor.avatarImageId);

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
            <div><span className="font-semibold">Condition:</span> <Badge variant="secondary">{book.condition}</Badge></div>
            <div><span className="font-semibold">ISBN:</span> {book.id.padStart(13, '9780')}</div>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-12 w-12">
                {donorAvatar && <AvatarImage src={donorAvatar.imageUrl} alt={book.donor.name} data-ai-hint={donorAvatar.imageHint} />}
                <AvatarFallback>{book.donor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-muted-foreground">Donated by</p>
                <p className="font-semibold">{book.donor.name}</p>
              </div>
            </CardHeader>
            <CardContent>
                <Button variant="outline" className="w-full">
                    <MessageSquare className="mr-2 h-4 w-4" /> Chat with {book.donor.name}
                </Button>
            </CardContent>
          </Card>

          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle className="font-headline">Get This Book</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                        <h3 className="font-bold text-lg">Buy It</h3>
                        <p className="text-sm text-muted-foreground">Own it forever.</p>
                    </div>
                    <p className="text-3xl font-bold text-primary">₹{book.price.toFixed(2)}</p>
                </div>
                 <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                        <h3 className="font-bold text-lg">Rent It</h3>
                        <p className="text-sm text-muted-foreground">For 30 days.</p>
                    </div>
                    <p className="text-3xl font-bold text-primary">₹{book.rent.toFixed(2)}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                    <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                        <ShoppingCart className="mr-2 h-5 w-5"/> Buy Now
                    </Button>
                    <Button size="lg">
                        <CalendarPlus className="mr-2 h-5 w-5"/> Rent Now
                    </Button>
                </div>
                 <p className="text-xs text-center text-muted-foreground pt-2">Secure payments processed by Razorpay.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
