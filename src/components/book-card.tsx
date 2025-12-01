import Link from "next/link";
import Image from "next/image";
import type { Book } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const image = PlaceHolderImages.find((img) => img.id === book.imageIds[0]);

  return (
    <Link href={`/books/${book.id}`} className="group">
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
        <CardHeader className="p-0">
          <div className="aspect-[2/3] relative">
            {image && (
              <Image
                src={image.imageUrl}
                alt={`Cover of ${book.title}`}
                data-ai-hint={image.imageHint}
                fill
                className="object-cover"
              />
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <h3 className="font-headline font-semibold text-lg leading-tight truncate group-hover:text-primary">
            {book.title}
          </h3>
          <p className="text-sm text-muted-foreground">{book.author}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <Badge variant="secondary">{book.condition}</Badge>
          <div className="text-right">
            <p className="font-semibold text-lg text-primary">${book.price.toFixed(2)}</p>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
