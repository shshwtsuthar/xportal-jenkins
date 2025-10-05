'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  role: z.enum([
    'ADMISSIONS_OFFICER',
    'SENIOR_ADMISSIONS_OFFICER',
    'COMPLIANCE_MANAGER',
    'ACADEMIC_HEAD',
    'FINANCE_OFFICER',
    'ADMIN',
  ]),
});

export function InviteUserDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      first_name: '',
      last_name: '',
      role: 'ADMISSIONS_OFFICER',
    },
  });

  const { mutate: inviteUser, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const supabase = createClient();

      // Get current user's RTO ID from app_metadata (avoid RLS and extra trips)
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError || !session) throw new Error('Not authenticated');
      const rtoId = (session.user.app_metadata as Record<string, unknown>)
        ?.rto_id as string | undefined;
      if (!rtoId) throw new Error('Missing RTO context');

      // Invite the user using admin API
      const { error } = await supabase.auth.admin.createUser({
        email: values.email,
        email_confirm: true,
        user_metadata: {
          first_name: values.first_name,
          last_name: values.last_name,
        },
        app_metadata: {
          rto_id: rtoId,
          role: values.role,
        },
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('User invited successfully');
      setOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Invite User</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite New User</DialogTitle>
          <DialogDescription>
            Send an invitation email to add a new staff member.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => inviteUser(values))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="staff@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ADMISSIONS_OFFICER">
                        Admissions Officer
                      </SelectItem>
                      <SelectItem value="SENIOR_ADMISSIONS_OFFICER">
                        Senior Admissions Officer
                      </SelectItem>
                      <SelectItem value="COMPLIANCE_MANAGER">
                        Compliance Manager
                      </SelectItem>
                      <SelectItem value="ACADEMIC_HEAD">
                        Academic Head
                      </SelectItem>
                      <SelectItem value="FINANCE_OFFICER">
                        Finance Officer
                      </SelectItem>
                      <SelectItem value="ADMIN">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Sending Invite...' : 'Send Invite'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
