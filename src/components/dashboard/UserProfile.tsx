import { Card } from "@/components/ui/card";
import { UserCircle } from "lucide-react";

interface UserProfileProps {
  email: string;
  role: string;
}

export const UserProfile = ({ email, role }: UserProfileProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="bg-primary/10 rounded-full p-3">
        <UserCircle className="w-8 h-8 text-primary" />
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-medium text-gray-900">
          Welcome back, <span className="text-primary">{email}</span>
        </h2>
        <p className="text-sm text-muted-foreground">
          Role: <span className="font-medium capitalize">{role}</span>
        </p>
      </div>
    </div>
  );
};