
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  authSignUpEmailPassword,
  sendOtpEmail,
} from '@/lib/services/authService';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, KeyRound, Mail } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

type AuthMethod = 'password' | 'otp';
type UserType = 'reader' | 'donor' | 'both';

export default function SignUpPage() {
  const router = useRouter();
  const [authMethod, setAuthMethod] = useState<AuthMethod>('password');

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<UserType>('reader');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Validation
  const validateForm = () => {
    setError('');
    if (!fullName.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!email.includes('@')) {
      setError('A valid email is required');
      return false;
    }
    if (authMethod === 'password') {
      if (password.length < 8) {
        setError('Password must be at least 8 characters');
        return false;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }
    return true;
  };

  // Sign up with Email & Password
  const handlePasswordSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    const result = await authSignUpEmailPassword(
      email,
      password,
      fullName,
      userType
    );

    if (result.success) {
      setSuccess(
        result.message ||
          'Account created! Check your email to confirm your account.'
      );
      setTimeout(() => router.push('/login'), 5000);
    } else {
      setError(result.error || 'An unknown error occurred.');
    }

    setLoading(false);
  };

  // Sign up with OTP
  const handleOtpSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    const result = await sendOtpEmail(email);

    if (result.success) {
      setSuccess(result.message || 'OTP sent to your email!');
      // Redirect to a verification page, passing the email along
      router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}`);
    } else {
      setError(result.error || 'Failed to send OTP.');
    }

    setLoading(false);
  };

  const currentFormSubmit =
    authMethod === 'password' ? handlePasswordSignUp : handleOtpSignUp;

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-headline">Create an Account</CardTitle>
        <CardDescription>Join our community of book lovers.</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4">
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-2 gap-2 mb-4">
          <Button
            variant={authMethod === 'password' ? 'default' : 'outline'}
            onClick={() => setAuthMethod('password')}
          >
            <KeyRound className="mr-2 h-4 w-4" /> Password
          </Button>
          <Button
            variant={authMethod === 'otp' ? 'default' : 'outline'}
            onClick={() => setAuthMethod('otp')}
          >
            <Mail className="mr-2 h-4 w-4" /> One-Time Code
          </Button>
        </div>
        
        <div className="flex items-center my-6">
            <Separator className="flex-1" />
            <span className="mx-4 text-xs text-muted-foreground uppercase">
                {authMethod === 'password' ? 'Sign up with Password' : 'Sign up with Email'}
            </span>
            <Separator className="flex-1" />
        </div>

        <form onSubmit={currentFormSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full-name">Full Name</Label>
              <Input
                id="full-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Aarav Patel"
                required
              />
            </div>
            <div className="space-y-2">
                <Label htmlFor="user-type">I am a...</Label>
                <Select
                    onValueChange={(value: UserType) => setUserType(value)}
                    defaultValue={userType}
                >
                    <SelectTrigger id="user-type">
                    <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="reader">Reader (Renter/Buyer)</SelectItem>
                    <SelectItem value="donor">Donor (Contributor)</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />
          </div>

          {authMethod === 'password' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
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
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  required
                />
              </div>
            </>
          )}

          {authMethod === 'otp' && (
             <Alert variant="default" className="text-sm">
                <Mail className="h-4 w-4" />
                <AlertTitle>Password-Free Login</AlertTitle>
                <AlertDescription>
                 We'll send a one-time code to your email to verify your account.
                </AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading
              ? authMethod === 'password' ? 'Creating Account...' : 'Sending Code...'
              : authMethod === 'password' ? 'Create Account' : 'Send Verification Code'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-center text-sm">
        <p className="w-full">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline font-semibold">
            Sign In
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
