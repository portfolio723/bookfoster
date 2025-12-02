import Link from "next/link";
import { Instagram, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="space-y-2">
            <h3 className="font-bold text-lg font-headline">Books For Foster</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto md:mx-0">
               BFF (Books For Foster) is India’s first community-driven free book rental network helping students access essential learning material without cost.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Links</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary">About</Link></li>
              <li><Link href="/donate" className="hover:text-primary">Donate</Link></li>
              <li><Link href="/#borrow" className="hover:text-primary">Borrow</Link></li>
              <li><Link href="/faq" className="hover:text-primary">FAQs</Link></li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Legal</h3>
            <ul className="space-y-1 text-muted-foreground">
                <li><Link href="/terms" className="hover:text-primary">Terms</Link></li>
                <li><Link href="/privacy" className="hover:text-primary">Privacy</Link></li>
                <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center mt-8 border-t pt-6">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} BFF: Books For Foster. An initiative by PixelKliq.
            </p>
             <div className="flex items-center gap-4 mt-4 md:mt-0">
                <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram className="h-5 w-5" /></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter className="h-5 w-5" /></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary"><Linkedin className="h-5 w-5" /></Link>
            </div>
        </div>
      </div>
    </footer>
  );
}
