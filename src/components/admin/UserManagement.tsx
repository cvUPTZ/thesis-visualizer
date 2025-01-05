import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Shield, ShieldCheck, User, Settings, UserPlus } from 'lucide-react';

export const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*');

      if (error) throw error;
      setRoles(data || []);
    } catch (error: any) {
      console.error('Error fetching roles:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch roles',
        variant: 'destructive',
      });
    }
  };

  const fetchUsers = async () => {
    try {
      console.log('Fetching users...');
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          roles (
            name
          )
        `);

      if (error) throw error;
      console.log('Users fetched:', data);
      setUsers(data || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, roleId: string) => {
    try {
      console.log('Updating user role...', { userId, roleId });
      const { error } = await supabase
        .from('profiles')
        .update({ role_id: roleId })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'User role updated successfully',
      });
      fetchUsers();
    } catch (error: any) {
      console.error('Error updating user role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive',
      });
    }
  };

  const getRoleBadgeColor = (roleName: string) => {
    switch (roleName) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'user':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-admin-accent-tertiary">User Management</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2 text-admin-accent-primary hover:text-admin-accent-secondary border-admin-accent-primary/20 hover:border-admin-accent-secondary/40"
          >
            <UserPlus className="w-4 h-4" />
            Add User
          </Button>
          <Button 
            variant="outline" 
            className="gap-2 text-admin-accent-primary hover:text-admin-accent-secondary border-admin-accent-primary/20 hover:border-admin-accent-secondary/40"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border border-admin-accent-secondary/30">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-admin-accent-tertiary">User</TableHead>
              <TableHead className="text-admin-accent-tertiary">Current Role</TableHead>
              <TableHead className="text-admin-accent-tertiary">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-admin-accent-primary" />
                    {user.email}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="secondary"
                    className={`${getRoleBadgeColor(user.roles?.name)} flex w-fit items-center gap-1`}
                  >
                    {user.roles?.name === 'admin' ? (
                      <ShieldCheck className="h-3 w-3" />
                    ) : (
                      <Shield className="h-3 w-3" />
                    )}
                    {user.roles?.name || 'No role'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Select
                    onValueChange={(value) => updateUserRole(user.id, value)}
                    defaultValue={user.role_id || ''}
                  >
                    <SelectTrigger className="w-[180px] border-admin-accent-primary/20 text-admin-accent-primary">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};