import React, { createContext, useContext, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
interface NotificationContextType {
    toast: ReturnType<typeof useToast>["toast"];
  notifyDomainError: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
    toast: () => {},
  notifyDomainError: () => {},
});

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();

  const notifyDomainError = useCallback(() => {
       toast({
          title: "Domain Verification Required",
           description: "The email domain needs to be verified. Please verify your domain at Resend.com before sending invitations.",
            variant: "destructive",
        });
    }, [toast]);

  return (
        <NotificationContext.Provider value={{ toast, notifyDomainError }}>
            {children}
       </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
    if (!context) {
       throw new Error('useNotification must be used within a NotificationProvider');
   }
    return context;
};