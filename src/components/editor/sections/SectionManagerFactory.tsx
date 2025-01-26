import React from 'react';
import { Section, SectionType } from '@/types/thesis';
import { AbstractSectionManager } from './managers/AbstractSectionManager';
import { IntroductionSectionManager } from './managers/IntroductionSectionManager';
import { ConclusionSectionManager } from './managers/ConclusionSectionManager';
import { ReferenceSectionManager } from './managers/ReferenceSectionManager';

interface SectionManagerFactoryProps {
  section: Section;
  onUpdate: (section: Section) => void;
}

export const SectionManagerFactory: React.FC<SectionManagerFactoryProps> = ({
  section,
  onUpdate,
}) => {
  console.log('SectionManagerFactory rendering:', { 
    sectionId: section.id,
    sectionType: section.type 
  });

  switch (section.type) {
    case SectionType.ABSTRACT:
      return <AbstractSectionManager section={section} onUpdate={onUpdate} />;
    
    case SectionType.GENERAL_INTRODUCTION:
    case SectionType.INTRODUCTION:
      return <IntroductionSectionManager section={section} onUpdate={onUpdate} />;
    
    case SectionType.GENERAL_CONCLUSION:
    case SectionType.CONCLUSION:
      return <ConclusionSectionManager section={section} onUpdate={onUpdate} />;
    
    case SectionType.REFERENCES:
      return <ReferenceSectionManager section={section} onUpdate={onUpdate} />;
    
    default:
      return <IntroductionSectionManager section={section} onUpdate={onUpdate} />;
  }
};