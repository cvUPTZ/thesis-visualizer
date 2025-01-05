import React, { createContext, useContext, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { User, SignInResponse } from '@/types/auth';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const signInMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }): Promise<SignInResponse> => {
      const { data: { user }, error } = await supabase.auth
        .signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

      if (error) throw error;
      if (!user) throw new Error('No user returned from sign in');

      // Fetch user role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role_id')
        .eq('id', user.id)
        .single();

      const { data: role } = await supabase
        .from('roles')
        .select('name')
        .eq('id', profile?.role_id)
        .single();

      setUser(user);
      setUserRole(role?.name || 'user');

      return {
        user: {
          ...user,
          role: role?.name || 'user'
        },
        userRole: role?.name || 'user'
      };
    }
  });

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, userRole, signInMutation, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
