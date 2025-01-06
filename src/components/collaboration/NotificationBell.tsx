import React from 'react';
import { Bell, BellRing } from 'lucide-react';

interface NotificationBellProps {
  hasNewInvites: boolean;
  onClear: () => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  hasNewInvites,
  onClear,
}) => {
  return (
    <div onClick={onClear} className="relative ml-auto cursor-pointer">
      {hasNewInvites ? (
        <BellRing className="w-6 h-6 text-blue-500 animate-bounce" />
      ) : (
        <Bell className="w-6 h-6" />
      )}
      {hasNewInvites && (
        <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
          !
        </span>
      )}
    </div>
  );
};