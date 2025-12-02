'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { confirmEmail } from '@/lib/services/authService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

export default function ConfirmEmailPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Confirming your email...');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const hash = window.location.hash;
        const token = new URLSearchParams(hash.substring(1)).get('access_token');

        if (!token) {
          setStatus('error');
          setMessage('Invalid or missing confirmation token in the URL.');
          return;
        }

        const result = await confirmEmail(token);

        if (result.success) {
          setStatus('success');
          setMessage('Email confirmed successfully! You will be redirected shortly.');
          setTimeout(() => router.push('/'), 3000);
        } else {
          setStatus('error');
          setMessage(result.error || 'Failed to confirm email. The link may have expired.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
      }
    };

    verifyEmail();
  }, [router]);

  return (
    <Card className="w-full max-w-md text-center">
        {status === 'loading' && (
            <>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Confirming Your Email</CardTitle>
                    <CardDescription>Please wait while we verify your email address.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center p-10">
                    <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
                    <p className="text-muted-foreground">{message}</p>
                </CardContent>
            </>
        )}

        {status === 'success' && (
            <>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-green-600">Success!</CardTitle>
                    <CardDescription>Your email has been confirmed.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center p-10">
                    <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
                    <p className="text-muted-foreground">{message}</p>
                </CardContent>
            </>
        )}
        
        {status === 'error' && (
            <>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-destructive">Verification Failed</CardTitle>
                    <CardDescription>There was a problem with your confirmation.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center p-10">
                    <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
                    <p className="text-muted-foreground">{message}</p>
                    <Button asChild className="mt-6">
                        <Link href="/login">Back to Login</Link>
                    </Button>
                </CardContent>
            </>
        )}
    </Card>
  );
}
