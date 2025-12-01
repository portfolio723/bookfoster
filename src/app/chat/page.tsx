"use client";

import Link from "next/link";
import { Search, Filter } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const conversations = [
  {
    id: "1",
    userName: "Priya Sharma (Seller)",
    userImage: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxJbmRpYW4lMjBwZXJzb24lMjBwb3J0cmFpdHxlbnwwfHx8fDE3NjQ4NzAyMjd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    userImageHint: "Indian person",
    bookTitle: "The Midnight Library",
    bookImage: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxib29rJTIwY292ZXJ8ZW58MHx8fHwxNzY0NDgyODA5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    bookImageHint: "book cover",
    lastMessage: "Great! The condition is 'Like New', correct?",
    timestamp: "10:31 AM",
    unreadCount: 2,
    type: "Rent",
  },
  {
    id: "2",
    userName: "Arjun Verma (Donor)",
    userImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxJbmRpYW4lMjBtYW58ZW58MHx8fHwxNzY0ODcwMjU4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    userImageHint: "Indian man",
    bookTitle: "Atomic Habits",
    bookImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxib29rJTIwY292ZXJ8ZW58MHx8fHwxNzY0NDgyODA5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    bookImageHint: "book cover",
    lastMessage: "Sure, pickup is available. Address shared below.",
    timestamp: "Yesterday",
    unreadCount: 0,
    type: "Donation",
  },
    {
    id: "3",
    userName: "Ananya Reddy (Seller)",
    userImage: "https://images.unsplash.com/photo-1601288496920-b6154fe3626a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxJbmRpYW4lMjB3b21hbnxlbnwwfHx8fDE3NjQ4NzAyNzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    userImageHint: "Indian woman",
    bookTitle: "Sapiens",
    bookImage: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxib29rJTIwY292ZXJ8ZW58MHx8fHwxNzY0NDgyODA5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    bookImageHint: "book cover",
    lastMessage: "Okay, I'll confirm. What is the price?",
    timestamp: "2 days ago",
    unreadCount: 0,
    type: "Buy",
  },
];

export default function ChatsDashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4">
                <h1 className="text-2xl font-bold font-headline">Chats</h1>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                     <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input placeholder="Search chats..." className="pl-10" />
                    </div>
                    <Button variant="outline" size="icon">
                        <Filter className="h-5 w-5" />
                        <span className="sr-only">Filter chats</span>
                    </Button>
                </div>
            </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-4 sm:py-6">
        <div className="max-w-4xl mx-auto">
            {conversations.length > 0 ? (
                <div className="border rounded-lg overflow-hidden bg-card">
                    <div className="divide-y">
                        {conversations.map((convo) => (
                            <Link key={convo.id} href={`/chat/${convo.id}`} className="block hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-4 p-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={convo.userImage} alt={convo.userName} data-ai-hint={convo.userImageHint} className="object-cover" />
                                        <AvatarFallback>{convo.userName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 grid gap-1">
                                        <div className="flex justify-between items-start">
                                            <p className="font-semibold">{convo.userName}</p>
                                            <span className="text-xs text-muted-foreground whitespace-nowrap">{convo.timestamp}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
                                        <div className="mt-1 flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                              <img src={convo.bookImage} alt={convo.bookTitle} className="h-8 w-8 rounded-sm object-cover" data-ai-hint={convo.bookImageHint} />
                                              <Badge variant={convo.type === 'Donation' ? 'secondary' : 'default'} className={convo.type === 'Donation' ? '' : 'bg-primary/10 text-primary border-primary/20'}>{convo.type}</Badge>
                                          </div>
                                           {convo.unreadCount > 0 && (
                                              <Badge variant="destructive" className="h-5 w-5 justify-center p-0">{convo.unreadCount}</Badge>
                                           )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            ) : (
            <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-lg h-full">
                <div className="text-5xl">📭</div>
                <h2 className="mt-4 text-xl font-semibold">No conversations yet.</h2>
                <p className="mt-1 text-muted-foreground">
                Start by exploring books and messaging a seller or donor.
                </p>
                <Button asChild className="mt-6">
                    <Link href="/">Browse Books</Link>
                </Button>
            </div>
            )}
        </div>
      </main>
    </div>
  );
}
