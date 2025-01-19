import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Home, 
  User, 
  UserCog, 
  FileText, 
  BookOpen, 
  ChevronRight, 
  ChevronLeft,
  ScrollText,
  BookMarked,
  HandshakeIcon,
  BookOpenCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const ThesisSidebar = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: User, label: 'Student Info', path: '/student-info' },
    { icon: UserCog, label: 'Supervisor Info', path: '/supervisor-info' },
    { icon: FileText, label: 'Thesis Info', path: '/thesis-info' },
    { icon: ScrollText, label: 'Abstract', path: '/abstract' },
    { icon: BookMarked, label: 'Statement', path: '/statement' },
    { icon: BookOpen, label: 'Preface', path: '/preface' },
    { icon: HandshakeIcon, label: 'Acknowledgments', path: '/acknowledgments' },
    { icon: BookOpenCheck, label: 'Chapters', path: '/chapters' }
  ];

  return (
    <div className={cn(
      "border-r bg-background/60 backdrop-blur-lg transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-end p-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <nav className="flex flex-col gap-2 p-2">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className={cn(
                  "justify-start gap-2",
                  isCollapsed && "justify-center"
                )}
                onClick={() => navigate(item.path)}
              >
                <item.icon className="h-5 w-5" />
                {!isCollapsed && <span>{item.label}</span>}
              </Button>
            ))}
          </nav>
        </ScrollArea>
      </div>
    </div>
  );
};