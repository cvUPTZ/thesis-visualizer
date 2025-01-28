import { supabase } from '@/integrations/supabase/client';
import { Section, SectionType } from '@/types/thesis';
import { validate as validateUUID } from 'uuid';

export class SectionService {
  static async createSection(
    thesisId: string,
    title: string = 'New Section',
    type: SectionType = SectionType.CUSTOM
  ): Promise<Section | null> {
    try {
      console.log('Creating new section:', { thesisId, title, type });
      
      if (!validateUUID(thesisId)) {
        throw new Error('Invalid thesis ID format');
      }

      const newSection: Section = {
        id: crypto.randomUUID(),
        thesis_id: thesisId,
        title,
        type,
        content: '',
        order: 1,
        required: false,
        figures: [],
        tables: [],
        citations: [],
        references: [],
        footnotes: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('sections')
        .insert(newSection)
        .select()
        .single();

      if (error) {
        console.error('Error creating section:', error);
        throw error;
      }

      console.log('Successfully created section:', data);
      return this.mapDatabaseToSection(data);
    } catch (err) {
      console.error('Error in section creation:', err);
      throw err;
    }
  }

  static async getSection(sectionId: string): Promise<Section | null> {
    try {
      console.log('Fetching section:', sectionId);
      
      if (!validateUUID(sectionId)) {
        throw new Error('Invalid section ID format');
      }

      const { data, error } = await supabase
        .from('sections')
        .select('*')
        .eq('id', sectionId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching section:', error);
        throw error;
      }

      if (!data) {
        return null;
      }

      console.log('Successfully fetched section:', data);
      return this.mapDatabaseToSection(data);
    } catch (err) {
      console.error('Error in section fetch:', err);
      throw err;
    }
  }

  static async updateSection(
    sectionId: string,
    updates: Partial<Section>
  ): Promise<Section | null> {
    try {
      console.log('Updating section:', { sectionId, updates });
      
      if (!validateUUID(sectionId)) {
        throw new Error('Invalid section ID format');
      }

      const { data, error } = await supabase
        .from('sections')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', sectionId)
        .select()
        .single();

      if (error) {
        console.error('Error updating section:', error);
        throw error;
      }

      console.log('Successfully updated section:', data);
      return this.mapDatabaseToSection(data);
    } catch (err) {
      console.error('Error in section update:', err);
      throw err;
    }
  }

  static async deleteSection(sectionId: string): Promise<void> {
    try {
      console.log('Deleting section:', sectionId);
      
      if (!validateUUID(sectionId)) {
        throw new Error('Invalid section ID format');
      }

      const { error } = await supabase
        .from('sections')
        .delete()
        .eq('id', sectionId);

      if (error) {
        console.error('Error deleting section:', error);
        throw error;
      }

      console.log('Successfully deleted section:', sectionId);
    } catch (err) {
      console.error('Error in section deletion:', err);
      throw err;
    }
  }

  private static mapDatabaseToSection(data: any): Section {
    return {
      id: data.id,
      thesis_id: data.thesis_id,
      title: data.title,
      content: data.content || '',
      type: data.type as SectionType,
      order: data.order || 1,
      required: data.required || false,
      figures: data.figures || [],
      tables: data.tables || [],
      citations: data.citations || [],
      references: data.references || [],
      footnotes: data.footnotes || [],
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  }
}