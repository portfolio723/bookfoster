
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { requestPasswordReset } from '@/lib/services/authService';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MailCheck, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    setError('');
    const result = await requestPasswordReset(email);
    if (result.success) {
      setSubmitted(true);
      setSubmittedEmail(email);
    } else {
      setError(result.error || 'An unexpected error occurred.');
    }
    setLoading(false);
  };

  if (submitted) {
    return (
        <Card className="w-full max-w-md text-center">
            <CardHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <MailCheck className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="mt-4 text-2xl font-bold">Check your email</CardTitle>
                <CardDescription>
                    We've sent a password reset link to <br />
                    <span className="font-semibold text-foreground">{submittedEmail}</span>.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    Didn't receive the email? Check your spam folder or try again.
                </p>
            </CardContent>
            <CardFooter className="flex-col gap-3">
                 <Button onClick={() => setSubmitted(false)} className="w-full">
                    Try another email
                </Button>
                <Button variant="ghost" asChild>
                    <Link href="/login">
                        <ArrowLeft className="mr-2 h-4 w-4"/>
                        Back to Sign In
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Forgot Password?</CardTitle>
        <CardDescription>
          No problem. Enter your email and we'll send you a reset link.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
            <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Sending Link...' : 'Send Reset Link'}
          </Button>
        </form>
      </CardContent>
       <CardFooter>
        <Button variant="link" className="w-full text-muted-foreground" asChild>
          <Link href="/login">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sign In
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
