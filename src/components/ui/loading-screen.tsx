// src/components/ui/loading-screen.tsx
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface LoadingScreenProps {
  title?: string;
}

export const LoadingScreen = ({ title = "Loading..." }: LoadingScreenProps) => {
  return (
    <Dialog open>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle className="text-center">{title}</DialogTitle>
        <div className="flex items-center justify-center p-6">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </DialogContent>
    </Dialog>
  );
};