import { Card } from "@/components/ui/card";
import { UserCircle } from "lucide-react";

interface UserProfileProps {
  email: string;
  role: string;
}

export const UserProfile = ({ email, role }: UserProfileProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="bg-[#9b87f5]/10 rounded-full p-3">
        <UserCircle className="w-8 h-8 text-[#9b87f5]" />
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-medium text-white">
          Welcome back, <span className="text-[#9b87f5]">{email}</span>
        </h2>
        <p className="text-sm text-[#D6BCFA]/80">
          Role: <span className="font-medium capitalize">{role}</span>
        </p>
      </div>
    </div>
  );
};