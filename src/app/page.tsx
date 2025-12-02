
import Link from "next/link";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Book, Heart, Recycle, Users, ArrowRight, BookMarked, BookUser, HandHeart } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const categories = [
    { name: 'Competitive Exams', icon: BookMarked, href: '/books?category=exam' },
    { name: 'School Textbooks', icon: Book, href: '/books?category=school' },
    { name: 'Skill Development', icon: BookUser, href: '/books?category=skill' },
    { name: 'Engineering & Medical', icon: Book, href: '/books?category=pro' },
    { name: 'Language Learning', icon: Book, href: '/books?category=language' },
    { name: 'Novels & Motivation', icon: Heart, href: '/books?category=novels' },
];

const testimonials = [
    {
        quote: "I couldn’t afford multiple exam books. BFF helped me prepare without financial stress. It’s an incredible platform for students like me.",
        name: "Vibha Sharma",
        role: "UPSC Aspirant",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400"
    },
    {
        quote: "Donating my old engineering books was so easy. It feels great knowing they are helping another student on their journey.",
        name: "Rohan Mehta",
        role: "Software Engineer & Donor",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400"
    },
    {
        quote: "The process was seamless. I found the exact textbook I needed for my semester exams, and it was completely free. Thank you, BFF!",
        name: "Ananya Reddy",
        role: "College Student",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400"
    }
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="text-center py-20 lg:py-32 px-4 bg-secondary/30">
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
              <Link href="#borrow">Borrow Books</Link>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <Link href="/auth/signup">Join the Community (Sign Up)</Link>
            </Button>
          </div>
        </section>
        
        {/* Why BFF Exists Section */}
        <section className="py-20 lg:py-24 px-4 container">
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-4xl font-bold font-headline mb-4">Why BFF Exists</h2>
                <p className="text-muted-foreground text-lg">
                    At BFF: Books for Foster, we believe education should never stop because of the cost of books. Our mission is to build a supportive, sustainable community where students can borrow books for free — and those who have finished their studies can give their books a new purpose.
                </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
                <Card className="text-center p-6">
                    <div className="mx-auto bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center mb-4">
                        <Book className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold font-headline">Free Access</h3>
                    <p className="text-muted-foreground mt-1">Unlock a library of academic and skill-based books at no cost.</p>
                </Card>
                <Card className="text-center p-6">
                    <div className="mx-auto bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center mb-4">
                        <Users className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold font-headline">Community Powered</h3>
                    <p className="text-muted-foreground mt-1">Join a network of students and donors helping each other succeed.</p>
                </Card>
                <Card className="text-center p-6">
                    <div className="mx-auto bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center mb-4">
                        <Recycle className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold font-headline">Sustainability</h3>
                    <p className="text-muted-foreground mt-1">Give books a second life, reducing waste and promoting a circular economy.</p>
                </Card>
                 <Card className="text-center p-6">
                    <div className="mx-auto bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center mb-4">
                        <HandHeart className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold font-headline">Real Impact</h3>
                    <p className="text-muted-foreground mt-1">Your donation directly empowers a student's educational journey.</p>
                </Card>
            </div>
        </section>

        {/* How It Works Section */}
        <section id="borrow" className="py-20 lg:py-24 px-4 bg-secondary/30">
            <div className="container text-center">
                <h2 className="text-4xl font-bold font-headline mb-12">How It Works</h2>
                <Tabs defaultValue="borrowers" className="max-w-4xl mx-auto">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="borrowers">For Borrowers</TabsTrigger>
                        <TabsTrigger value="donors">For Donors</TabsTrigger>
                    </TabsList>
                    <TabsContent value="borrowers">
                        <div className="grid md:grid-cols-3 gap-8 text-center mt-12">
                            <div className="flex flex-col items-center">
                                <div className="text-5xl mb-4">1️⃣</div>
                                <h3 className="font-bold text-lg">Browse & Request</h3>
                                <p className="text-muted-foreground">Search for the books you need and place a free rental request.</p>
                            </div>
                             <div className="flex flex-col items-center">
                                <div className="text-5xl mb-4">2️⃣</div>
                                <h3 className="font-bold text-lg">Coordinate & Collect</h3>
                                <p className="text-muted-foreground">Receive a notification to coordinate pickup from the donor or a BFF hub.</p>
                            </div>
                             <div className="flex flex-col items-center">
                                <div className="text-5xl mb-4">3️⃣</div>
                                <h3 className="font-bold text-lg">Study & Return</h3>
                                <p className="text-muted-foreground">Use the book for your studies and return it on time for the next student.</p>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="donors">
                        <div className="grid md:grid-cols-3 gap-8 text-center mt-12">
                            <div className="flex flex-col items-center">
                                <div className="text-5xl mb-4">1️⃣</div>
                                <h3 className="font-bold text-lg">Sign Up & List</h3>
                                <p className="text-muted-foreground">Create an account and easily upload the details of the books you want to donate.</p>
                            </div>
                             <div className="flex flex-col items-center">
                                <div className="text-5xl mb-4">2️⃣</div>
                                <h3 className="font-bold text-lg">Coordinate Drop-off</h3>
                                <p className="text-muted-foreground">Arrange for a pickup or drop your books off at a designated BFF center.</p>
                            </div>
                             <div className="flex flex-col items-center">
                                <div className="text-5xl mb-4">3️⃣</div>
                                <h3 className="font-bold text-lg">See Your Impact</h3>
                                <p className="text-muted-foreground">Get notified when your book finds a new learner and track its journey.</p>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </section>

        {/* Impact Section */}
        <section className="py-20 lg:py-24 px-4 bg-primary text-primary-foreground">
            <div className="container">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div>
                        <p className="text-5xl md:text-6xl font-bold font-headline">1,200+</p>
                        <p className="text-primary-foreground/80 mt-2">Books Donated</p>
                    </div>
                     <div>
                        <p className="text-5xl md:text-6xl font-bold font-headline">800+</p>
                        <p className="text-primary-foreground/80 mt-2">Students Benefited</p>
                    </div>
                     <div>
                        <p className="text-5xl md:text-6xl font-bold font-headline">50+</p>
                        <p className="text-primary-foreground/80 mt-2">Subjects Covered</p>
                    </div>
                     <div>
                        <p className="text-5xl md:text-6xl font-bold font-headline">5</p>
                        <p className="text-primary-foreground/80 mt-2">Cities Served</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Featured Categories Section */}
        <section className="py-20 lg:py-24 px-4 container">
             <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-4xl font-bold font-headline mb-4">Find Books Across All Topics</h2>
                <p className="text-muted-foreground text-lg mb-12">
                    From competitive exams to skill development, our library is constantly growing.
                </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories.map((category) => (
                    <Link href={category.href} key={category.name}>
                        <div className="group flex flex-col items-center justify-center p-4 border rounded-lg h-32 text-center transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:-translate-y-1">
                            <category.icon className="h-8 w-8 mb-2 transition-transform group-hover:scale-110" />
                            <p className="font-semibold text-sm">{category.name}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
        
        {/* Community Stories Section */}
        <section className="py-20 lg:py-24 px-4 bg-secondary/30">
            <div className="container">
                <h2 className="text-4xl font-bold font-headline text-center mb-12">Community Stories</h2>
                 <Carousel
                    opts={{ align: "start", loop: true }}
                    className="w-full max-w-4xl mx-auto"
                    >
                    <CarouselContent>
                        {testimonials.map((testimonial, index) => (
                        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                            <div className="p-1 h-full">
                            <Card className="h-full flex flex-col justify-between">
                                <CardContent className="p-6">
                                    <p className="text-muted-foreground">"{testimonial.quote}"</p>
                                </CardContent>
                                <div className="flex items-center gap-4 p-6 pt-0">
                                    <Avatar>
                                        <AvatarImage src={testimonial.avatar} data-ai-hint="person portrait" />
                                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{testimonial.name}</p>
                                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                    </div>
                                </div>
                            </Card>
                            </div>
                        </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden sm:flex" />
                    <CarouselNext className="hidden sm:flex" />
                    </Carousel>
            </div>
        </section>
        
        {/* Final CTA Section */}
        <section className="py-20 lg:py-24 px-4 container">
            <div className="max-w-3xl mx-auto text-center bg-primary text-primary-foreground p-12 rounded-lg">
                 <h2 className="text-4xl font-bold font-headline mb-4">Ready to Make a Difference?</h2>
                 <p className="text-primary-foreground/80 mb-8">
                    Whether you have books to give or need books to learn, you can start right now. Join our community and be a part of India's learning revolution.
                 </p>
                 <Button size="lg" variant="secondary" asChild>
                    <Link href="/auth/signup">
                        Join BFF Today <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                 </Button>
            </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
