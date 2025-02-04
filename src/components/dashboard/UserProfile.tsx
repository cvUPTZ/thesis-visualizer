
import { UserCircle } from "lucide-react";
import type { Profile } from '@/types/profile';

interface UserProfileProps {
  profile: Profile | null;
  onLogout: () => void;
  email?: string;
  role?: string;
}

export const UserProfile = ({ profile, onLogout }: UserProfileProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="bg-[#9b87f5]/10 rounded-full p-3">
        <UserCircle className="w-8 h-8 text-[#9b87f5]" />
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-medium font-serif text-white">
          Welcome back, <span className="text-[#9b87f5]">{profile?.email || 'Scholar'}</span>
        </h2>
        <p className="text-sm font-sans text-[#D6BCFA]/80">
          Role: <span className="font-medium capitalize">{profile?.roles?.name || 'User'}</span>
        </p>
      </div>
    </div>
  );
};

