import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface Section {
  id: number;
  title: string;
  progress: number;
  complete: boolean;
}

interface NotificationsPanelProps {
  showNotifications: boolean;
  sections: Section[];
}

export const NotificationsPanel = ({ showNotifications, sections }: NotificationsPanelProps) => {
  return (
    <AnimatePresence>
      {showNotifications && (
        <motion.div
          className="notifications-panel"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
        >
          <div className="notification-header">
            <AlertCircle size={20} />
            <span>Thesis Updates</span>
          </div>
          <div className="notification-content">
            {sections
              .filter(s => !s.complete)
              .map(section => (
                <div key={section.id} className="notification-item">
                  <span>{section.title} needs attention</span>
                  <span>{section.progress}% complete</span>
                </div>
              ))
            }
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};