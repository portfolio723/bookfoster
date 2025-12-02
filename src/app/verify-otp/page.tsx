
'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

function VerifyOtpComponent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const { verifyOtp } = useAuth();

    const [otp, setOtp] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        if (!email || !otp) {
            setError('Email and OTP are required.');
            return;
        }

        setLoading(true);
        try {
            await verifyOtp(email, otp, 'email');
            // On success, the onAuthStateChange listener in AuthContext will handle the redirect.
        } catch (err: any) {
            setError(err.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <Link href="/login" className="inline-block text-sm text-primary hover:underline mb-4">
                        <ArrowLeft className="inline-block mr-1 h-4 w-4" />
                        Back to Login
                    </Link>
                    <CardTitle className="text-2xl font-bold font-headline">Check your email</CardTitle>
                    <CardDescription>
                        We've sent a 6-digit one-time password (OTP) to {email}.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Verification Failed</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="otp">One-Time Password</Label>
                            <Input
                                id="otp"
                                name="otp"
                                type="text"
                                inputMode="numeric"
                                pattern="\d{6}"
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="123456"
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Verifying...' : 'Verify & Sign In'}
                        </Button>
                    </form>
                     <div className="mt-4 text-center text-sm">
                        <p className="text-muted-foreground">
                            Didn't receive the email? Check your spam folder or{" "}
                            <Button variant="link" className="p-0 h-auto" onClick={() => router.back()}>
                                try again
                            </Button>
                            .
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function VerifyOtpPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyOtpComponent />
        </Suspense>
    )
}
