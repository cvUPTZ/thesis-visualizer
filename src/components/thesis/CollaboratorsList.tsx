import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface Collaborator {
  user_id: string;
  role: string;
  profiles?: {
    email: string;
    role: string;
    roles?: {
      name: string;
    };
  };
}

interface CollaboratorsListProps {
  collaborators: Collaborator[];
  thesisId: string;
  isLoading?: boolean;
}

export const CollaboratorsList = ({ 
  collaborators, 
  thesisId,
  isLoading = false 
}: CollaboratorsListProps) => {
  console.log('Rendering CollaboratorsList:', { collaboratorsCount: collaborators.length, thesisId });

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'owner':
        return 'bg-primary text-primary-foreground';
      case 'editor':
        return 'bg-blue-500 text-white';
      case 'viewer':
        return 'bg-secondary text-secondary-foreground';
      case 'admin':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getInitials = (email: string) => {
    return email.split('@')[0].substring(0, 2).toUpperCase();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Users className="w-4 h-4" />
          Collaborators ({isLoading ? '...' : collaborators.length})
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            <h4 className="font-medium leading-none mb-4">Thesis Collaborators</h4>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : collaborators.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No collaborators yet
              </p>
            ) : (
              <div className="space-y-3">
                {collaborators.map((collaborator) => (
                  <div
                    key={collaborator.user_id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${collaborator.profiles?.email}`} 
                        alt={collaborator.profiles?.email} 
                      />
                      <AvatarFallback>
                        {collaborator.profiles?.email ? getInitials(collaborator.profiles.email) : '??'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {collaborator.profiles?.email || 'Unknown User'}
                      </p>
                      <div className="flex gap-2 mt-1">
                        <Badge 
                          variant="secondary"
                          className={`text-xs ${getRoleColor(collaborator.role)}`}
                        >
                          {collaborator.role}
                        </Badge>
                        {collaborator.profiles?.roles?.name === 'admin' && (
                          <Badge variant="destructive" className="text-xs">
                            Site Admin
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};