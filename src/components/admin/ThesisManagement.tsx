import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Eye, Trash2 } from 'lucide-react';

export const ThesisManagement = () => {
  const [theses, setTheses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTheses();
  }, []);

  const fetchTheses = async () => {
    try {
      const { data, error } = await supabase
        .from('theses')
        .select(`
          *,
          thesis_collaborators (
            user_id,
            role,
            profiles (
              email
            )
          )
        `);

      if (error) throw error;
      setTheses(data || []);
    } catch (error: any) {
      console.error('Error fetching theses:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch theses',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (thesisId: string) => {
    try {
      const { error } = await supabase
        .from('theses')
        .delete()
        .eq('id', thesisId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Thesis deleted successfully',
      });
      fetchTheses();
    } catch (error: any) {
      console.error('Error deleting thesis:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete thesis',
        variant: 'destructive',
      });
    }
  };

  const viewThesis = (thesisId: string) => {
    navigate(`/thesis/${thesisId}`);
  };

  if (loading) {
    return <div>Loading theses...</div>;
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {theses.map((thesis) => (
            <TableRow key={thesis.id}>
              <TableCell>{thesis.title}</TableCell>
              <TableCell>
                {thesis.thesis_collaborators?.find((tc: any) => tc.role === 'owner')?.profiles?.email || 'No owner'}
              </TableCell>
              <TableCell>
                {new Date(thesis.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => viewThesis(thesis.id)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(thesis.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};