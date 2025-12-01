import { ArrowLeft, Send, Phone, Video } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ChatPage() {
  const messages = [
    { from: "system", text: "You’re now connected with Priya Sharma for The Midnight Library. Please avoid sharing personal numbers. Use in-app chat only." },
    { from: "other", text: "Hi! Is 'The Midnight Library' still available for rent?", time: "10:30 AM" },
    { from: "me", text: "Hello! Yes, it is.", time: "10:31 AM" },
    { from: "other", text: "Great! The condition is 'Like New', correct?", time: "10:31 AM" },
    { from: "me", text: "That's right. It's in excellent shape, read only once.", time: "10:32 AM" },
    { from: "other", text: "Perfect, I'd like to proceed with the rental.", time: "10:33 AM" },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-0rem)] bg-muted/20">
      <header className="flex items-center gap-4 border-b bg-background px-4 lg:px-6 h-16 shrink-0 sticky top-0 z-10">
        <Link href="/chat" className="lg:hidden">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxJbmRpYW4lMjBwZXJzb24lMjBwb3J0cmFpdHxlbnwwfHx8fDE3NjQ4NzAyMjd8MA&ixlib=rb-4.1.0&q=80&w=1080" data-ai-hint="Indian person" />
              <AvatarFallback>PS</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold font-headline">Priya Sharma</p>
              <p className="text-sm text-muted-foreground">Online</p>
            </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon">
                <Phone className="h-5 w-5" />
                <span className="sr-only">Call</span>
            </Button>
            <Button variant="ghost" size="icon">
                <Video className="h-5 w-5" />
                <span className="sr-only">Video call</span>
            </Button>
        </div>
      </header>
       <div className="border-b bg-background p-3 sticky top-16 z-10 shadow-sm">
          <div className="max-w-2xl mx-auto flex items-center gap-4">
            <img src="https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxib29rJTIwY292ZXJ8ZW58MHx8fHwxNzY0NDgyODA5fDA&ixlib=rb-4.1.0&q=80&w=1080" data-ai-hint="book cover" alt="The Midnight Library" className="h-16 w-12 rounded-sm object-cover" />
            <div className="flex-grow">
              <h3 className="font-semibold leading-tight">The Midnight Library</h3>
              <p className="text-sm text-primary font-bold">₹499.00 | Rent: ₹99.00</p>
            </div>
            <Button variant="outline" size="sm" asChild>
                <Link href="/books/1">View Details</Link>
            </Button>
          </div>
       </div>
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="space-y-4 max-w-2xl mx-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-end gap-2 ${
                msg.from === "me" ? "justify-end" : ""
              } ${
                msg.from === "system" ? "justify-center" : ""
              }`}
            >
              {msg.from === "other" && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxJbmRpYW4lMjBwZXJzb24lMjBwb3J0cmFpdHxlbnwwfHx8fDE3NjQ4NzAyMjd8MA&ixlib=rb-4.1.0&q=80&w=1080" data-ai-hint="Indian person" />
                  <AvatarFallback>PS</AvatarFallback>
                </Avatar>
              )}
               <div
                className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                  msg.from === "me"
                    ? "bg-primary text-primary-foreground"
                    : msg.from === "other"
                    ? "bg-background shadow-sm"
                    : "bg-transparent text-muted-foreground text-xs text-center w-full"
                }`}
              >
                <p>{msg.text}</p>
                {msg.time && <p className={`text-xs mt-1 ${
                  msg.from === "me"
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground"
                }`}>{msg.time}</p>}
              </div>
            </div>
          ))}
        </div>
      </main>
      <footer className="border-t bg-background px-4 py-3 sm:px-6 sticky bottom-0">
        <div className="relative max-w-2xl mx-auto">
          <Input placeholder="Type your message..." className="pr-12" />
          <Button
            type="submit"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </footer>
    </div>
  );
}
