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

      const { data: newSection, error } = await supabase.rpc(
        'create_section_if_not_exists',
        {
          p_thesis_id: thesisId,
          p_section_title: title,
          p_section_type: type
        }
      );

      if (error) {
        console.error('Error creating section:', error);
        throw error;
      }

      if (!newSection) {
        console.error('No section created');
        return null;
      }

      console.log('Successfully created section:', newSection);
      return newSection as Section;
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

      const { data: section, error } = await supabase
        .from('sections')
        .select('*')
        .eq('id', sectionId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching section:', error);
        throw error;
      }

      console.log('Successfully fetched section:', section);
      return section as Section;
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

      const { data: updatedSection, error } = await supabase
        .from('sections')
        .update(updates)
        .eq('id', sectionId)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error updating section:', error);
        throw error;
      }

      console.log('Successfully updated section:', updatedSection);
      return updatedSection as Section;
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
}