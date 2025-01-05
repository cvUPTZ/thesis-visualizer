import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ThesisListItemProps {
  id: string;
  title: string;
  isLoading: boolean;
  onSelect: (id: string) => void;
}

export const ThesisListItem = ({ id, title, isLoading, onSelect }: ThesisListItemProps) => {
  return (
    <Button
      variant="ghost"
      className="w-full text-left text-gray-300 hover:bg-white/5 hover:text-white font-sans"
      onClick={() => onSelect(id)}
      disabled={isLoading}
    >
      {title}
      {isLoading && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
    </Button>
  );
};