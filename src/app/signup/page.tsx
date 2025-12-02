
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, AlertTriangle } from 'lucide-react';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48" {...props}>
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"/>
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.222 0-9.612-3.512-11.284-8.281l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
        <path fill="#1976D2" d="M43.611 20.083H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l6.19 5.238C42.021 35.533 44 30.023 44 24c0-1.341-.138-2.65-.389-3.917z"/>
    </svg>
);


export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);

  const handleSignup = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = formData.get('password');
    const confirmPassword = formData.get('confirm-password');

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter them.");
    } else {
      setError(null);
      // Proceed with sign-up logic
      console.log("Passwords match. Signing up...");
    }
  };
  
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
          <form onSubmit={handleSignup} className="w-full max-w-md space-y-6">
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
            
             {error && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Sign-up Error</AlertTitle>
                    <AlertDescription>
                        {error}
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input id="first-name" name="first-name" placeholder="Aarav" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input id="last-name" name="last-name" placeholder="Patel" required />
                </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                name="email"
                type="email"
                placeholder="name@example.com" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input id="confirm-password" name="confirm-password" type="password" required />
            </div>
            
            <div className="flex items-start space-x-3">
                <Checkbox id="terms" required />
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
                <Button variant="outline" type="button">
                    <GoogleIcon className="mr-2 h-5 w-5" />
                    Sign up with Google
                </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
