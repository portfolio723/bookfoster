
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useState } from "react";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

// A simple SVG for Google Icon
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48" {...props}>
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"/>
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.222 0-9.612-3.512-11.284-8.281l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
        <path fill="#1976D2" d="M43.611 20.083H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l6.19 5.238C42.021 35.533 44 30.023 44 24c0-1.341-.138-2.65-.389-3.917z"/>
    </svg>
);


export default function LoginPage() {
    const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('email');
    const [error, setError] = useState<string | null>(null);
    const [resetEmail, setResetEmail] = useState('');
    const { signIn, signInWithGoogle } = useAuth();


    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        const formData = new FormData(event.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            await signIn(email, password);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        }
    }
    
    const handlePasswordReset = async () => {
        if (!resetEmail) {
            setError("Please enter your email address.");
            return;
        }
        const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
            redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) {
            setError(error.message);
        } else {
            alert('Password reset link sent! Check your email.');
        }
    }

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
                    &ldquo;That’s the thing about books. They let you travel without moving your feet.&rdquo;
                    </p>
                    <footer className="text-lg">- Jhumpa Lahiri</footer>
                </blockquote>
            </div>
        </div>

        <main className="flex items-center justify-center p-8">
            <Card className="w-full max-w-md border-0 shadow-none md:border md:shadow-lg">
                <CardHeader className="text-left space-y-2">
                    <Link href="/" className="md:hidden mb-4 inline-block text-sm text-primary hover:underline">
                        <ArrowLeft className="inline-block mr-1 h-4 w-4" />
                        Back to website
                    </Link>
                    <CardTitle className="text-3xl font-headline">Welcome Back</CardTitle>
                    <CardDescription>
                        Sign in to access your wishlist, cart, and rentals.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {error && (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Login Failed</AlertTitle>
                            <AlertDescription>
                                {error} You can also <Link href="/signup" className="underline font-semibold">create a new account</Link>.
                            </AlertDescription>
                        </Alert>
                    )}
                    <div className="grid grid-cols-1 gap-4">
                        <Button variant="outline" onClick={signInWithGoogle}>
                            <GoogleIcon className="mr-2 h-5 w-5" />
                            Sign in with Google
                        </Button>
                    </div>
                    <div className="flex items-center">
                        <Separator className="flex-1" />
                        <span className="mx-4 text-xs text-muted-foreground uppercase">Or continue with</span>
                        <Separator className="flex-1" />
                    </div>
                    
                    <form onSubmit={handleLogin} className="space-y-4">
                        {loginMethod === 'phone' ? (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                    required
                                    />
                                </div>
                                <Button type="submit" className="w-full">
                                    Send OTP
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
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
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Password</Label>
                                        <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="link" className="p-0 h-auto text-xs">Forgot Password?</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                            <AlertDialogTitle>Reset Password</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Enter your email address below and we'll send you a link to reset your password.
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <div className="space-y-2">
                                                <Label htmlFor="reset-email">Email Address</Label>
                                                <Input id="reset-email" type="email" placeholder="name@example.com" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} />
                                            </div>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={handlePasswordReset}>Send Reset Link</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                    <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    />
                                </div>
                                <Button type="submit" className="w-full">
                                    Sign In
                                </Button>
                            </div>
                        )}
                    </form>
                    
                    <div className="text-center">
                        <Button variant="link" onClick={() => setLoginMethod(loginMethod === 'phone' ? 'email' : 'phone')}>
                            {loginMethod === 'phone' ? 'Use Email Instead' : 'Use Phone Instead'}
                        </Button>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col items-center justify-center text-sm text-muted-foreground space-y-2 text-center">
                    <p>Don't have an account? <Link href="/signup" className="text-primary font-semibold hover:underline">Sign Up</Link></p>
                    <p>By continuing, you agree to our Terms of Service.</p>
                </CardFooter>
            </Card>
        </main>
      </div>
    </div>
  );
}
