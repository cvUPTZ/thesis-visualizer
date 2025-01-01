import React, { createContext, useContext } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Toast as ToastComponent } from "@/components/ui/toast";
import type { ToastProps } from "@/components/ui/toast";

interface NotificationContextType {
    toast: ReturnType<typeof useToast>['toast'];
    notifyDomainError: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
    toast: () => ({ id: '', dismiss: () => {}, update: () => {} }),
    notifyDomainError: () => {},
});

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const { toast } = useToast();

    const notifyDomainError = () => {
        toast({
            title: "Domain Verification Required",
            description: "The email domain needs to be verified. Please verify your domain at Resend.com before sending invitations.",
            variant: "destructive",
        });
    };

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