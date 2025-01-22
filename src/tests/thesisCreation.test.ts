import { render, screen, fireEvent } from '@testing-library/react';
import { ThesisCreationModal } from '../components/thesis/ThesisCreationModal';
import { supabase } from '../integrations/supabase/client';

jest.mock('../integrations/supabase/client');

describe('ThesisCreationModal', () => {
  beforeEach(() => {
    // Mock the supabase.auth.getSession to return a user session
    jest.spyOn(supabase.auth, 'getSession').mockResolvedValue({
      data: { session: { user: { id: 'user-id' } } },
    });
  });

  test('creates a thesis and redirects', async () => {
    render(<ThesisCreationModal />);

    // Simulate selecting a template
    const template = { structure: { frontMatter: [], chapters: [], backMatter: [] } };
    fireEvent.click(screen.getByText('New Thesis'));
    fireEvent.click(screen.getByText('Choose a Template'));

    // Simulate the creation process
    await fireEvent.click(screen.getByText('Create Thesis')); // Adjust this to match the button text

    // Check if the thesis was created and the redirection occurred
    expect(supabase.from).toHaveBeenCalledWith('theses');
    expect(supabase.from('theses').insert).toHaveBeenCalled();
  });
});
