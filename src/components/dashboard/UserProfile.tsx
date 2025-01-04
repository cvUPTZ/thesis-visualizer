import { Card } from "@/components/ui/card";

interface UserProfileProps {
  email: string;
  role: string;
}

export const UserProfile = ({ email, role }: UserProfileProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-serif font-bold text-primary mb-2">
        Welcome, {email}
      </h1>
      <p className="text-gray-600">Role: {role}</p>
    </div>
  );
};