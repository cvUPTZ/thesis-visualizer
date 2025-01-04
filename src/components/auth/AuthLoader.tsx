import { Loader2 } from "lucide-react";

export const AuthLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
    </div>
  );
};