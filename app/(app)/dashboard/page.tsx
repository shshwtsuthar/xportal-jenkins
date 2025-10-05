import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default async function DashboardPage() {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();
  if (sessionError || !session) {
    redirect('/login');
  }

  // Use verified user from Auth server
  const { data: userRes } = await supabase.auth.getUser();
  const role = (
    userRes.user?.app_metadata as Record<string, unknown> | undefined
  )?.role;

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome to your Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back! You are logged in as {String(role)}.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Applications</CardTitle>
            <CardDescription>Manage student applications</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              View and process student applications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Students</CardTitle>
            <CardDescription>Manage student records</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              View and manage student information
            </p>
          </CardContent>
        </Card>

        {role === 'ADMIN' && (
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage staff accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Invite and manage staff members
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
