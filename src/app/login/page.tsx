
'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// A simple SVG for Google Icon
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-1.5c-.83 0-1.5.67-1.5 1.5V12h3l-.5 3h-2.5v6.8c4.56-.93 8-4.96 8-9.8z"/>
    </svg>
);


export default function LoginPage() {
    const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] bg-muted/20 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-headline">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to access your wishlist, cart, and rentals.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
                 <Button variant="outline">
                    <GoogleIcon className="mr-2 h-5 w-5" />
                    Sign in with Google
                </Button>
            </div>
            <div className="flex items-center">
                <Separator className="flex-1" />
                <span className="mx-4 text-xs text-muted-foreground uppercase">Or continue with</span>
                <Separator className="flex-1" />
            </div>

            {loginMethod === 'phone' ? (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        required
                        />
                    </div>
                    <Button className="w-full">
                        Send OTP
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        required
                        />
                    </div>
                    <Button className="w-full">
                        Send Magic Link
                    </Button>
                </div>
            )}
            
            <div className="text-center">
                <Button variant="link" onClick={() => setLoginMethod(loginMethod === 'phone' ? 'email' : 'phone')}>
                    {loginMethod === 'phone' ? 'Use Email Instead' : 'Use Phone Instead'}
                </Button>
            </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center text-sm text-muted-foreground space-y-2">
            <p>Don't have an account? <Link href="/signup" className="text-primary hover:underline">Sign Up</Link></p>
            <p>By continuing, you agree to our Terms of Service.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
