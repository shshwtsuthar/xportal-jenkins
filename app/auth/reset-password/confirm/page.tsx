import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ResetPasswordConfirmPage() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Check Your Email
          </CardTitle>
          <CardDescription>
            We&apos;ve sent you a password reset link. Click the link in the
            email to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              If you don&apos;t see the email, check your spam folder. The link
              will expire in 24 hours.
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/login">Return to Login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
