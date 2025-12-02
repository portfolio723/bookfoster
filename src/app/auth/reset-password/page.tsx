'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updatePassword } from '@/lib/services/authService';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, KeyRound, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isValidToken, setIsValidToken] = useState(false);

  useEffect(() => {
    // Supabase redirects with the access token in the hash
    if (window.location.hash.includes('access_token')) {
      setIsValidToken(true);
    } else {
        setError('Invalid or expired password reset link. Please request a new one.');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const result = await updatePassword(password);
    if (result.success) {
      setSuccess('Your password has been reset successfully! You will be redirected to the sign-in page.');
      setTimeout(() => {
        router.push('/login?message=Password+reset+successfully');
      }, 3000);
    } else {
      setError(result.error || 'An unexpected error occurred.');
    }
    setLoading(false);
  };

  if (!isValidToken) {
    return (
        <Card className="w-full max-w-md text-center">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-destructive">Invalid Link</CardTitle>
                <CardDescription>This password reset link is either invalid or has expired.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-10">
                <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
                <p className="text-muted-foreground">{error}</p>
                <Button asChild className="mt-6">
                    <Link href="/auth/forgot-password">Request New Link</Link>
                </Button>
            </CardContent>
        </Card>
    );
  }
  
  if (success) {
    return (
        <Card className="w-full max-w-md text-center">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-green-600">Password Reset!</CardTitle>
                <CardDescription>You can now sign in with your new password.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-10">
                <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
                <p className="text-muted-foreground">{success}</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <KeyRound className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold text-center">Create New Password</CardTitle>
        <CardDescription className="text-center">
          Choose a new password for your account. Make it secure!
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
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat your new password"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Updating Password...' : 'Set New Password'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
