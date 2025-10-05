import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { LoginForm } from './_components/LoginForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default async function LoginPage() {
  const supabase = await createClient();

  // Check if user is already logged in
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Welcome to XPortal
          </CardTitle>
          <CardDescription>
            Sign in to access your RTO management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
