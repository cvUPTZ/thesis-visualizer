import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  LayoutDashboard, 
  Image, 
  Table as TableIcon, 
  BookOpen,
  Library
} from 'lucide-react';

export const ChapterSidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Image, label: 'Figures', path: '/figures' },
    { icon: TableIcon, label: 'Tables', path: '/tables' },
    { icon: Library, label: 'Bibliography', path: '/bibliography' },
    { icon: BookOpen, label: 'Chapters', path: '/chapters' }
  ];

  return (
    <div className="w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <ScrollArea className="h-full py-6">
        <div className="space-y-1 px-2">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => navigate(item.path)}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};