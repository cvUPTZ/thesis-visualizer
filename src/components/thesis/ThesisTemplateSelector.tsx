import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

interface ThesisTemplate {
  id: string;
  name: string;
  description: string;
  structure: any;
  language: string;
}

interface ThesisTemplateSelectorProps {
  onSelect: (template: ThesisTemplate) => void;
}

export const ThesisTemplateSelector: React.FC<ThesisTemplateSelectorProps> = ({ onSelect }) => {
  const { toast } = useToast();
  
  const { data: templates, isLoading, error } = useQuery({
    queryKey: ['thesis-templates'],
    queryFn: async () => {
      console.log('Fetching thesis templates');
      const { data, error } = await supabase
        .from('thesis_templates')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching templates:', error);
        throw error;
      }

      console.log('Fetched templates:', data);
      return data as ThesisTemplate[];
    }
  });

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load thesis templates",
      variant: "destructive",
    });
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-[200px] w-full" />
        ))}
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {templates?.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow cursor-pointer">
              <h3 className="text-lg font-medium">{template.name}</h3>
              <p className="text-sm text-muted-foreground">{template.description}</p>
              <Button 
                onClick={() => onSelect(template)}
                className="w-full"
              >
                Use This Template
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  );
};