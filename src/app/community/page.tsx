
'use client';

import { useState } from 'react';
import { Hash, Users, Search, Send, AtSign, Menu, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const channels = [
  { id: '1', name: 'general', unread: 2 },
  { id: '2', name: 'book-recommendations', unread: 0 },
  { id: '3', name: 'fiction-lovers', unread: 5 },
  { id: '4', name: 'non-fiction-club', unread: 0 },
  { id: '5', name: 'classic-literature', unread: 1 },
];

const onlineUsers = [
  { id: 'u1', name: 'Aarav Patel', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxJbmRpYW4lMjBtYW58ZW58MHx8fHwxNzY0ODcwMjU4fDA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'Indian man' },
  { id: 'u2', name: 'Priya Sharma', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxJbmRpYW4lMjBwZXJzb24lMjBwb3J0cmFpdHxlbnwwfHx8fDE3NjQ4NzAyMjd8MA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'Indian person' },
  { id: 'u3', name: 'Ananya Reddy', avatar: 'https://images.unsplash.com/photo-1601288496920-b6154fe3626a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxJbmRpYW4lMjB3b21hbnxlbnwwfHx8fDE3NjQ4NzAyNzh8MA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'Indian woman' },
  { id: 'u4', name: 'Rohan Mehta', avatar: 'https://picsum.photos/seed/4/40/40', hint: 'man portrait' },
];

const messages = {
  '1': [
    { userId: 'u2', text: 'Hey everyone! Just finished "The Midnight Library". What a read! Has anyone else read it?', time: '10:40 AM' },
    { userId: 'u3', text: 'Oh, I loved that one! The concept was so unique.', time: '10:41 AM' },
    { userId: 'me', text: 'I have it on my wishlist! I should probably move it to the top of my list.', time: '10:42 AM' },
    { userId: 'u1', text: 'Definitely do! It makes you think. Welcome to the community btw!', time: '10:43 AM' },
  ],
  '3': [
    { userId: 'u4', text: 'Any good sci-fi recommendations? I just finished the Dune series.', time: 'Yesterday' },
    { userId: 'me', text: 'If you liked Dune, you have to read "Project Hail Mary" by Andy Weir. It\'s incredible.', time: 'Yesterday' },
    { userId: 'u4', text: 'Oh nice, I loved The Martian. I\'ll check it out. Thanks!', time: 'Yesterday' },
    { userId: 'u1', text: 'Seconding Project Hail Mary. One of the best books I\'ve read in years.', time: 'Today 9:15 AM' },
    { userId: 'u2', text: '@Rohan Mehta Let us know what you think when you read it!', time: 'Today 9:16 AM' },
  ]
};

const SidebarContent = ({ activeChannel, onChannelSelect }: { activeChannel: string; onChannelSelect: (id: string) => void }) => (
    <div className="flex flex-col h-full">
        <div className="p-4 border-b">
            <h2 className="text-xl font-bold font-headline flex items-center gap-2"><Users /> Community Hub</h2>
        </div>
        <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
                <div>
                    <h3 className="text-sm font-semibold text-muted-foreground px-2 mb-1">Channels</h3>
                    <nav className="space-y-1">
                    {channels.map((channel) => (
                        <Button
                        key={channel.id}
                        variant={activeChannel === channel.id ? 'secondary' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => onChannelSelect(channel.id)}
                        >
                        <Hash className="mr-2 h-4 w-4" />
                        <span>{channel.name}</span>
                        {channel.unread > 0 && <span className="ml-auto bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">{channel.unread}</span>}
                        </Button>
                    ))}
                    </nav>
                </div>
                <Separator />
                <div>
                    <h3 className="text-sm font-semibold text-muted-foreground px-2 mb-2">Online — {onlineUsers.length}</h3>
                     <nav className="space-y-2">
                        {onlineUsers.map((user) => (
                            <div key={user.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 cursor-pointer">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={user.avatar} data-ai-hint={user.hint} />
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-sm truncate">{user.name}</span>
                            </div>
                        ))}
                    </nav>
                </div>
            </div>
        </ScrollArea>
    </div>
);


export default function CommunityPage() {
    const [activeChannel, setActiveChannel] = useState('1');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const currentMessages = messages[activeChannel as keyof typeof messages] || [];
    const currentChannel = channels.find(c => c.id === activeChannel);
    const getUser = (userId: string) => {
        if (userId === 'me') return { id: 'me', name: 'You', avatar: 'https://picsum.photos/seed/me/40/40', hint: 'person' };
        return onlineUsers.find(u => u.id === userId);
    }

  return (
    <div className="flex h-screen bg-background text-foreground">
        {/* Mobile Sidebar */}
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetContent side="left" className="p-0 w-80">
                <SidebarContent activeChannel={activeChannel} onChannelSelect={(id) => { setActiveChannel(id); setIsSidebarOpen(false); }} />
            </SheetContent>
        </Sheet>

        {/* Desktop Sidebar */}
        <aside className="hidden md:flex md:w-80 md:flex-col md:border-r">
            <SidebarContent activeChannel={activeChannel} onChannelSelect={setActiveChannel} />
        </aside>

        {/* Main Chat Area */}
        <main className="flex flex-1 flex-col">
            <header className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6 shrink-0">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(true)}>
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open channels</span>
                </Button>
                <div className="flex-1">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Hash className="h-5 w-5 text-muted-foreground" />
                        {currentChannel?.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">Discuss all things books and connect with fellow readers.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input placeholder="Search channel..." className="pl-10 w-48 md:w-64" />
                </div>
            </header>

            <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                    <div className="p-4 md:p-6 space-y-4">
                        {currentMessages.map((msg, index) => {
                            const user = getUser(msg.userId);
                            return (
                                <div key={index} className="flex items-start gap-4">
                                    <Avatar>
                                        <AvatarImage src={user?.avatar} data-ai-hint={user?.hint} />
                                        <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-baseline gap-2">
                                            <p className="font-semibold">{user?.name}</p>
                                            <p className="text-xs text-muted-foreground">{msg.time}</p>
                                        </div>
                                        <div className={cn("prose prose-sm max-w-none text-foreground", msg.text.includes('@') && "has-mention")}>
                                            <p dangerouslySetInnerHTML={{ __html: msg.text.replace(/(@\w+)/, '<span class="bg-primary/10 text-primary font-semibold p-1 rounded-md">$&</span>')}}></p>
                                        </div>
                                    </div>
                                </div>
                            );
                         })}
                    </div>
                </ScrollArea>
            </div>
            
            <footer className="border-t bg-background px-4 py-3 sm:px-6">
                <div className="relative">
                    <Input placeholder={`Message #${currentChannel?.name}`} className="pr-12" />
                    <Button type="submit" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8">
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                    </Button>
                </div>
            </footer>
        </main>
    </div>
  );
}
