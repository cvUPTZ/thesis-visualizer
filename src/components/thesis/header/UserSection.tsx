import { User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface UserSectionProps {
  userEmail: string;
  userRole: string;
}

export const UserSection = ({ userEmail, userRole }: UserSectionProps) => {
  return (
    <div className="flex items-center gap-2">
      <User className="w-4 h-4" />
      <span className="text-sm">{userEmail}</span>
      <Badge variant="secondary" className="text-xs">
        {userRole}
      </Badge>
    </div>
  );
};