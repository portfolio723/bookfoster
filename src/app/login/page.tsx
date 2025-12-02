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
import { AlertTriangle, ArrowLeft, KeyRound, Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { requestPasswordReset, sendOtpEmail } from "@/lib/services/authService";

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48" {...props}>
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"/>
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.222 0-9.612-3.512-11.284-8.281l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
        ... (rest of your component code)
        <path fill="#1976D2" d="M43.611 20.083H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l6.19 5.238C42.021 35.533 44 30.023 44 24c0-1.341-.138-2.65-.389-3.917z"/>
    </svg>
);


export default function LoginPage() {
    const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [resetEmail, setResetEmail] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { signIn, signInWithGoogle } = useAuth();
    const router = useRouter();


    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setMessage(null);
        setLoading(true);
        
        if (loginMethod === 'password') {
            try {
                await signIn(email, password);
                // On success, the AuthProvider's onAuthStateChange listener will redirect.
            } catch (err: any) {
                setError(err.message || 'An unexpected error occurred.');
            }
        } else { // OTP method
            try {
                const result = await sendOtpEmail(email);
                if (result.success) {
                    router.push(`/auth/verify?email=${encodeURIComponent(email)}`);
                } else {
                    throw new Error(result.error);
                }
            } catch (err: any) {
                setError(err.message || 'Failed to send OTP.');
            }
        }
        setLoading(false);
    }
    
    const handlePasswordReset = async () => {
        setError(null);
        setMessage(null);
        if (!resetEmail) {
            setError("Please enter your email address.");
            return;
        }
        const result = await requestPasswordReset(resetEmail);
        if (result.error) {
            setError(result.error);
        } else {
            setMessage(result.message);
        }
    }

  return (
      <Card>
          <CardHeader className="text-center">
              <CardTitle className="text-3xl font-headline">Welcome Back</CardTitle>
              <CardDescription>
                  Sign in to access your wishlist, cart, and rentals.
              </CardDescription>
          </CardHeader>
          <CardContent>
              {error && (
                  <Alert variant="destructive" className="mb-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Login Failed</AlertTitle>
                      <AlertDescription>
                          {error}
                      </AlertDescription>
                  </Alert>
              )}
              {message && (
                  <Alert className="mb-4">
                      <AlertTitle>Heads up!</AlertTitle>
                      <AlertDescription>
                          {message}
                      </AlertDescription>
                  </Alert>
              )}
              <div className="grid grid-cols-1 gap-4">
                  <Button variant="outline" onClick={signInWithGoogle}>
                      <GoogleIcon className="mr-2 h-5 w-5" />
                      Sign in with Google
                  </Button>
              </div>

              <div className="flex items-center my-6">
                  <Separator className="flex-1" />
                  <span className="mx-4 text-xs text-muted-foreground uppercase">Or</span>
                  <Separator className="flex-1" />
              </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                    <Button
                        variant={loginMethod === 'password' ? 'default' : 'outline'}
                        onClick={() => setLoginMethod('password')}
                    >
                        <KeyRound className="mr-2 h-4 w-4" /> Password
                    </Button>
                    <Button
                        variant={loginMethod === 'otp' ? 'default' : 'outline'}
                        onClick={() => setLoginMethod('otp')}
                    >
                        <Mail className="mr-2 h-4 w-4" /> One-Time Code
                    </Button>
                </div>
              
              <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      />
                  </div>
                  {loginMethod === 'password' && (
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
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          />
                      </div>
                  )}

                    {loginMethod === 'otp' && (
                        <Alert variant="default" className="text-sm">
                            <Mail className="h-4 w-4" />
                            <AlertTitle>Password-Free Login</AlertTitle>
                            <AlertDescription>
                            We'll send a one-time code to your email to sign you in.
                            </AlertDescription>
                        </Alert>
                    )}

                  <Button type="submit" className="w-full" disabled={loading}>
                      {loading 
                        ? loginMethod === 'password' ? 'Signing In...' : 'Sending Code...'
                        : loginMethod === 'password' ? 'Sign In with Password' : 'Send Sign-In Code'}
                  </Button>
              </form>

          </CardContent>
          <CardFooter className="text-center text-sm">
              <p className="w-full">
                  Don't have an account?{' '}
                  <Link href="/auth/signup" className="text-primary hover:underline font-semibold">
                      Sign Up
                  </Link>
              </p>
          </CardFooter>
      </Card>
  );
}
