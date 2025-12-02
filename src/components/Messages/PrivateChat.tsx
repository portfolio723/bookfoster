'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { sendPrivateMessage, getConversation } from '@/lib/services/messagingService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

export default function PrivateChat({ recipientId, recipientName, recipientAvatar }: { recipientId: string; recipientName: string, recipientAvatar?: string }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name[0] || '';
  };

  const loadMessages = async () => {
    if (!user) return;
    const result = await getConversation(user.id, recipientId);
    if (result.success && result.messages) {
      setMessages(result.messages);
    }
    setLoading(false);
  };
  
  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [user, recipientId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim()) return;

    // Optimistically update UI
    const optimisticMessage = {
      id: Math.random(), // temporary id
      sender_id: user.id,
      message: newMessage,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimisticMessage]);
    setNewMessage('');
    
    await sendPrivateMessage(user.id, recipientId, newMessage);
    
    // Fetch latest messages to confirm
    await loadMessages();
  };

  return (
    <div className="flex flex-col h-full bg-muted/20">
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="space-y-4 max-w-2xl mx-auto">
          {loading && <p className="text-center text-muted-foreground">Loading chat...</p>}
          {!loading && messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${
                msg.sender_id === user?.id ? "justify-end" : ""
              }`}
            >
              {msg.sender_id !== user?.id && (
                <Avatar className="h-8 w-8">
                  {recipientAvatar && <AvatarImage src={recipientAvatar} />}
                  <AvatarFallback>{getInitials(recipientName)}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                  msg.sender_id === user?.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-background shadow-sm"
                }`}
              >
                <p>{msg.message}</p>
                <p className={`text-xs mt-1 ${
                  msg.sender_id === user?.id
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground"
                }`}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <footer className="border-t bg-background px-4 py-3 sm:px-6">
        <form onSubmit={handleSend} className="relative max-w-2xl mx-auto">
          <Input 
            placeholder="Type your message..." 
            className="pr-12"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
            disabled={!newMessage.trim()}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </footer>
    </div>
  );
}
