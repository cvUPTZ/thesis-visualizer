import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Home,
  User,
  FileText,
  BookOpen,
  Quote,
  PenTool,
  Heart,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  BookText,
  Bookmark
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const ThesisSidebar = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const navigate = useNavigate();

  const frontMatterItems = [
    { icon: User, label: 'Student Info', path: '/student-info' },
    { icon: GraduationCap, label: 'Supervisor Info', path: '/supervisor-info' },
    { icon: FileText, label: 'Thesis Info', path: '/thesis-info' },
    { icon: BookOpen, label: 'Abstract', path: '/abstract' },
    { icon: Quote, label: 'Statement', path: '/statement' },
    { icon: PenTool, label: 'Preface', path: '/preface' },
    { icon: Heart, label: 'Acknowledgments', path: '/acknowledgments' },
  ];

  const mainContentItems = [
    { icon: BookText, label: 'Chapters', path: '/chapters' },
    { icon: Bookmark, label: 'References', path: '/references' }
  ];

  return (
    <div className={cn(
      "flex flex-col gap-4 p-4 border-r bg-background/60 backdrop-blur-lg transition-all duration-300",
      isCollapsed ? "w-[70px]" : "w-[240px]"
    )}>
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          className={cn(
            "shrink-0",
            isCollapsed && "mx-auto"
          )}
        >
          <Home className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="space-y-4 py-4">
        <ScrollArea className="h-[calc(100vh-8rem)] pr-2">
          <nav className="flex flex-col gap-2">
            {!isCollapsed && (
              <div className="px-2">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Front Matter</h4>
              </div>
            )}
            
            {frontMatterItems.map((item) => (
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

            {!isCollapsed && (
              <div className="mt-4 px-2">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Main Content</h4>
              </div>
            )}
            
            {mainContentItems.map((item) => (
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