const findSection = async (): Promise<Section | null> => {
  if (!thesis || !sectionId || !thesisId) {
    console.log('Missing required parameters:', { hasThesis: !!thesis, sectionId, thesisId });
    return null;
  }

  // Look for existing section first by id
  const existingSection = findExistingSection(thesis, sectionId);
  if (existingSection) {
    console.log('Found existing section by ID:', existingSection);
    return existingSection;
  }
  
  // Check for general sections by their type if no ID match
  if (sectionId === 'general-introduction' && thesis.generalIntroduction) {
    console.log('Found existing general introduction by type:', thesis.generalIntroduction);
      return thesis.generalIntroduction
  }
  if (sectionId === 'general-conclusion' && thesis.generalConclusion) {
    console.log('Found existing general conclusion by type:', thesis.generalConclusion);
      return thesis.generalConclusion
  }

  // If not found, ensure thesis structure and create new section
  try {
      const completeThesis = ensureThesisStructure(thesis);
      
      // Update thesis with complete structure
      console.log('Updating thesis with complete structure...');
      const { error: updateError } = await supabase
        .from('theses')
        .update({ 
          content: completeThesis,
          updated_at: new Date().toISOString()
        })
        .eq('id', thesisId);

      if (updateError) {
        console.error('Error updating thesis structure:', updateError);
        throw updateError;
      }
      
     // Create new section based on its route id
     let newSectionType: string;

     if(sectionId === 'general-introduction') newSectionType = 'general_introduction'
     else if (sectionId === 'general-conclusion') newSectionType = 'general_conclusion'
     else newSectionType = 'custom';

     console.log('Creating new section type:', newSectionType);

     const { data: newSectionId, error: createError } = await supabase.rpc(
       'create_section_if_not_exists',
       { 
         p_thesis_id: thesisId,
         p_section_title: 'New Section',
         p_section_type: newSectionType
       }
     );

     if (createError) {
       console.error('Error creating new section:', createError);
       throw createError;
     }
   
    // Fetch updated thesis
    console.log('Fetching updated thesis...');
    const { data: refreshedThesis, error: refreshError } = await supabase
      .from('theses')
      .select('*')
      .eq('id', thesisId)
      .single();

    if (refreshError) throw refreshError;

    if (!refreshedThesis) {
        throw new Error('Failed to fetch updated thesis');
      }
      
    const content = typeof refreshedThesis.content === 'string' 
        ? JSON.parse(refreshedThesis.content) 
        : refreshedThesis.content;

      let newSection;
      if(sectionId === 'general-introduction' || sectionId === 'general-conclusion'){
        newSection = content[sectionId]
      }
      else{
        newSection = findExistingSection(content, newSectionId);
      }

    if (!newSection) {
        throw new Error('New section not found in updated thesis');
    }
  
    return newSection;

  } catch (err) {
    console.error('Error in section creation process:', err);
    throw new Error(`Failed to create new section: ${err.message}`);
  }
};

const findExistingSection = (thesis: Thesis, targetId: string): Section | null => {
    // Check special sections
    if (thesis.generalIntroduction?.id === targetId) return thesis.generalIntroduction;
    if (thesis.generalConclusion?.id === targetId) return thesis.generalConclusion;

    // Check front matter
    const frontMatterSection = thesis.frontMatter?.find(s => s.id === targetId);
    if (frontMatterSection) return frontMatterSection;

    // Check back matter
    const backMatterSection = thesis.backMatter?.find(s => s.id === targetId);
    if (backMatterSection) return backMatterSection;

    // Check chapters
    for (const chapter of thesis.chapters || []) {
      const chapterSection = chapter.sections.find(s => s.id === targetId);
      if (chapterSection) return chapterSection;
    }

    return null;
  };

  const handleContentChange = async (newContent: string) => {
    if (!thesis || !section || !thesisId) return;

    try {
      console.log('Handling content change...');
      const updatedThesis = { ...thesis };
  
        // Update the appropriate section
       if (section.type === 'general_introduction') {
        updatedThesis.generalIntroduction = {
            ...updatedThesis.generalIntroduction,
            content: newContent
          };
        } else if (section.type === 'general_conclusion') {
          updatedThesis.generalConclusion = {
            ...updatedThesis.generalConclusion,
            content: newContent
          };
        } else {
           // Update in front/back matter or chapters
          const frontMatterIndex = thesis.frontMatter?.findIndex(s => s.id === section.id) ?? -1;
            if (frontMatterIndex !== -1) {
            updatedThesis.frontMatter[frontMatterIndex] = {
              ...thesis.frontMatter[frontMatterIndex],
              content: newContent
            };
          } else {
          const backMatterIndex = thesis.backMatter?.findIndex(s => s.id === section.id) ?? -1;
          if (backMatterIndex !== -1) {
          updatedThesis.backMatter[backMatterIndex] = {
              ...thesis.backMatter[backMatterIndex],
              content: newContent
            };
          } else {
              updatedThesis.chapters = (thesis.chapters || []).map(chapter => ({
                  ...chapter,
                  sections: chapter.sections.map(s => 
                  s.id === section.id ? { ...s, content: newContent } : s
              ),
          }));
          }
      }

        // Ensure complete structure before saving
        const completeThesis = ensureThesisStructure(updatedThesis);

      console.log('Saving updated thesis...');
      const { error } = await supabase
          .from('theses')
          .update({ 
            content: completeThesis,
            updated_at: new Date().toISOString()
          })
          .eq('id', thesisId);
  
        if (error) throw error;
        
        setThesis(completeThesis);
        setSection({ ...section, content: newContent });
  
        toast({
          title: "Success",
          description: "Content updated successfully",
        });
      } catch (err) {
        console.error('Error updating content:', err);
        toast({
          title: "Error",
          description: "Failed to update content. Please try again.",
          variant: "destructive",
        });
      }
};