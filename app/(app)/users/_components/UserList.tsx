'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

export function UserList() {
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const supabase = createClient();

      // Get current user's RTO ID
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const rtoId = (session.user.app_metadata as Record<string, unknown>)
        ?.rto_id as string;
      if (!rtoId) throw new Error('Missing RTO context');

      // Get profiles for the current RTO
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('rto_id', rtoId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get auth users data separately
      const { data: authUsers } = await supabase.auth.admin.listUsers();

      // Combine the data
      return (
        profiles?.map((profile) => {
          const authUser = authUsers?.users.find((u) => u.id === profile.id);
          return {
            ...profile,
            email: authUser?.email,
            created_at: authUser?.created_at,
          };
        }) || []
      );
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                {user.first_name} {user.last_name}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant="secondary">{user.role}</Badge>
              </TableCell>
              <TableCell>
                {user.created_at
                  ? format(new Date(user.created_at), 'PPP')
                  : 'N/A'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
