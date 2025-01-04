import { Loader2 } from "lucide-react";

export const AuthLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-gray-500">Checking authentication status...</p>
      </div>
    </div>
  );
};