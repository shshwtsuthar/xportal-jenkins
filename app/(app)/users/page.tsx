import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { UserList } from './_components/UserList';
import { InviteUserDialog } from './_components/InviteUserDialog';

export default async function UsersPage() {
  const supabase = await createClient();

  // Check if user is admin
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
  if (role !== 'ADMIN') {
    redirect('/dashboard');
  }

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          User Management
        </h1>
        <InviteUserDialog />
      </div>
      <UserList />
    </div>
  );
}
