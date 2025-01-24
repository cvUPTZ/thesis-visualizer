import { render, screen, fireEvent } from '@testing-library/react';
import { ThesisCreationModal } from '../components/thesis/ThesisCreationModal';
import { supabase } from '../integrations/supabase/client';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../integrations/supabase/client');

describe('ThesisCreationModal', () => {
  beforeEach(() => {
    // Mock the supabase.auth.getSession to return a user session
    jest.spyOn(supabase.auth, 'getSession').mockResolvedValue({
      data: { 
        session: { 
          user: { 
            id: 'user-id' 
          } 
        } 
      },
      error: null
    });
  });

  test('creates a thesis and redirects', async () => {
    render(
      <BrowserRouter>
        <ThesisCreationModal />
      </BrowserRouter>
    );

    // Simulate selecting a template
    const template = { 
      structure: { 
        metadata: {
          description: '',
          keywords: [],
          createdAt: new Date().toISOString(),
          universityName: '',
          departmentName: '',
          authors: [],
          supervisors: [],
          committeeMembers: [],
          thesisDate: '',
          language: 'en',
          version: '1.0'
        },
        frontMatter: [],
        generalIntroduction: {
          id: crypto.randomUUID(),
          title: 'General Introduction',
          content: '',
          type: 'general-introduction',
          required: true,
          order: 1,
          figures: [],
          tables: [],
          citations: [],
          references: []
        },
        chapters: [],
        generalConclusion: {
          id: crypto.randomUUID(),
          title: 'General Conclusion',
          content: '',
          type: 'general-conclusion',
          required: true,
          order: 1,
          figures: [],
          tables: [],
          citations: [],
          references: []
        },
        backMatter: []
      }
    };
    
    fireEvent.click(screen.getByText('New Thesis'));
    fireEvent.click(screen.getByText('Choose a Template'));

    // Simulate the creation process
    await fireEvent.click(screen.getByText('Create Thesis'));

    // Check if the thesis was created and the redirection occurred
    expect(supabase.from).toHaveBeenCalledWith('theses');
    expect(supabase.from('theses').insert).toHaveBeenCalled();
  });
});