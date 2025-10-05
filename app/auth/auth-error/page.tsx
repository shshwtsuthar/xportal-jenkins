import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AuthErrorPage() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Authentication Error
          </CardTitle>
          <CardDescription>
            There was a problem with your authentication request.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              This could be due to an expired link, invalid token, or a system
              error. Please try signing in again.
            </p>
            <Button variant="default" className="w-full" asChild>
              <Link href="/login">Return to Login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
