import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Collaborator {
  user_id: string;
  role: string;
  profiles?: {
    email: string;
    role: string;
  };
}

interface CollaboratorsListProps {
  collaborators: Collaborator[];
}

export const CollaboratorsList = ({ collaborators }: CollaboratorsListProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Users className="w-4 h-4" />
          Collaborators ({collaborators.length})
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <ScrollArea className="h-[200px] pr-4">
          <div className="space-y-2">
            {collaborators.map((collaborator) => (
              <div
                key={collaborator.user_id}
                className="flex items-center justify-between p-2 bg-muted rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{collaborator.profiles?.email || collaborator.user_id}</span>
                  <Badge variant="secondary" className="text-xs">
                    {collaborator.role}
                  </Badge>
                  {collaborator.profiles?.role === 'admin' && (
                    <Badge variant="default" className="text-xs">
                      Site Admin
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};