// File: src/components/thesis/UserInfo.tsx
import { User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface UserInfoProps {
  email: string;
  role: string;
}

export const UserInfo = ({ email, role }: UserInfoProps) => {
  return (
    <div className="flex items-center gap-2">
      <User className="w-4 h-4" />
      <span className="text-sm">{email}</span>
      <Badge variant="secondary" className="text-xs">
        {role}
      </Badge>
    </div>
  );
};