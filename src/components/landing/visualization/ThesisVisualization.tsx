import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Thesis } from '@/types/thesis';
import { supabase } from '@/integrations/supabase/client';

export const ThesisVisualization = () => {
  const [thesis, setThesis] = useState<Thesis | null>(null);

  useEffect(() => {
    const fetchThesis = async () => {
      const { data, error } = await (supabase.from('theses' as any) as any)
        .select('*')
        .limit(1)
        .single();

      if (error || !data) return;

      const content = typeof data.content === 'string' 
        ? JSON.parse(data.content)
        : data.content;

      setThesis({
        ...data,
        content,
      } as Thesis);
    };

    fetchThesis();
  }, []);

  if (!thesis) return null;

  const chapters = thesis.content?.chapters || [];

  return (
    <div className="relative w-full h-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0"
      >
        <div className="grid grid-cols-3 gap-4 p-4">
          {chapters.map((chapter: any, index: number) => (
            <motion.div
              key={chapter.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-card rounded-lg shadow"
            >
              <h3 className="font-bold">{chapter.title}</h3>
              <p className="text-sm text-muted-foreground">
                {chapter.sections?.length || 0} sections
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
