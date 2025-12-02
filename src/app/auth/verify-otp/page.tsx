
'use client';

import { Suspense, useState, useEffect } from 'react';
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
import Link from 'next/link';
import { resendOtp, verifyOtpEmail } from '@/lib/services/authService';

function VerifyOtpComponent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    const [otp, setOtp] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setSuccess('');

        if (!email || !otp || otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP.');
            return;
        }

        setLoading(true);
        const result = await verifyOtpEmail(email, otp);
        if (result.success) {
            setSuccess('Verification successful! You are now signed in.');
            // The onAuthStateChange listener in AuthContext will handle the redirect.
             setTimeout(() => router.push('/'), 2000);
        } else {
            setError(result.error || 'Invalid OTP. Please try again.');
        }
        setLoading(false);
    };
    
    const handleResend = async () => {
        if (!email || resendCooldown > 0) return;
        setLoading(true);
        setError('');
        setSuccess('');
        
        const result = await resendOtp(email);
        if(result.success) {
            setSuccess(result.message);
            setResendCooldown(60); // 60-second cooldown
        } else {
            setError(result.error);
        }
        setLoading(false);
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
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
                 {success && (
                    <Alert className="mb-4">
                        <AlertTitle>Success!</AlertTitle>
                        <AlertDescription>{success}</AlertDescription>
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
                            pattern="\\d{6}"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="123456"
                            required
                            className="text-center text-lg tracking-[0.5em]"
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading || otp.length < 6}>
                        {loading ? 'Verifying...' : 'Verify & Sign In'}
                    </Button>
                </form>
                 <div className="mt-4 text-center text-sm">
                    <p className="text-muted-foreground">
                        Didn't receive the email?{' '}
                        <Button variant="link" className="p-0 h-auto" onClick={handleResend} disabled={resendCooldown > 0}>
                           {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
                        </Button>
                    </p>
                     <p className="mt-2">
                        <Link href="/login" className="inline-flex items-center text-muted-foreground hover:text-primary">
                            <ArrowLeft className="mr-1 h-4 w-4" />
                            Back to Login
                        </Link>
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

export default function VerifyOtpPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyOtpComponent />
        </Suspense>
    )
}
