
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft } from 'lucide-react';

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-1.5c-.83 0-1.5.67-1.5 1.5V12h3l-.5 3h-2.5v6.8c4.56-.93 8-4.96 8-9.8z"/>
  </svg>
);

export default function SignupPage() {
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid md:grid-cols-2 min-h-screen">
        <div className="hidden md:flex flex-col justify-between p-8 bg-primary text-primary-foreground relative">
          <Image 
            src="https://images.unsplash.com/photo-1532012197267-da84d127e765?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxsaWJyYXJ5fGVufDB8fHx8MTc2NDg3MTE5OXww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Library background"
            fill
            className="object-cover opacity-20"
            data-ai-hint="library"
          />
          <div className="relative z-10">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold font-headline">
              Book Foster
            </Link>
          </div>
          <div className="relative z-10">
             <blockquote className="space-y-2">
                <p className="text-2xl">
                  &ldquo;A reader lives a thousand lives before he dies . . . The man who never reads lives only one.&rdquo;
                </p>
                <footer className="text-lg">- George R.R. Martin</footer>
              </blockquote>
          </div>
        </div>

        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-6">
            <div>
              <Link href="/" className="md:hidden mb-6 inline-block text-sm text-primary hover:underline">
                  <ArrowLeft className="inline-block mr-1 h-4 w-4" />
                  Back to website
              </Link>
              <h1 className="text-3xl font-bold font-headline">Create an account</h1>
              <p className="text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-primary hover:underline">
                  Log in
                </Link>
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input id="first-name" placeholder="Aarav" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input id="last-name" placeholder="Patel" required />
                </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={authMethod}>{authMethod === 'phone' ? 'Phone Number' : 'Email Address'}</Label>
              <Input 
                id={authMethod} 
                type={authMethod === 'phone' ? 'tel' : 'email'} 
                placeholder={authMethod === 'phone' ? '+91 98765 43210' : 'name@example.com'} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            
            <div className="flex items-start space-x-3">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="text-sm font-normal text-muted-foreground">
                    By creating an account, you agree to our{' '}
                    <Link href="/terms" className="underline hover:text-primary">
                        Terms & Conditions
                    </Link>
                    .
                </Label>
            </div>

            <Button type="submit" className="w-full">
              Create account
            </Button>
            
            <div className="flex items-center">
              <div className="flex-1 border-t" />
              <div className="px-4 text-xs uppercase text-muted-foreground">
                Or continue with
              </div>
              <div className="flex-1 border-t" />
            </div>

            <div className="grid grid-cols-1 gap-4">
                <Button variant="outline">
                    <GoogleIcon />
                    Google
                </Button>
            </div>

             <div className="text-center">
                <Button variant="link" size="sm" onClick={() => setAuthMethod(authMethod === 'phone' ? 'email' : 'phone')}>
                   {authMethod === 'phone' ? 'Use Email Instead' : 'Use Phone Instead'}
                </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

