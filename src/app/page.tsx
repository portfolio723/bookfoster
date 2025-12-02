import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow">
        <section className="text-center py-20 lg:py-32 px-4">
          <h1 className="text-5xl md:text-7xl font-black font-headline mb-4">
            A Book Shared is a Future Built.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Empowering students with free book rentals through a community-driven donation platform by PixelKliq.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/donate">Donate Books</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/#borrow">Borrow Books</Link>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <Link href="/auth/signup">Join the Community (Sign Up)</Link>
            </Button>
          </div>
        </section>
        
        {/* Placeholder for future sections */}

      </main>
      <Footer />
    </div>
  );
}
