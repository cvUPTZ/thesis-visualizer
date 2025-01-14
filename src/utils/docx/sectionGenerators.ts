import { Section, Chapter } from '@/types/thesis';

export const generateTableOfContents = (
  frontMatter: Section[],
  chapters: Chapter[],
  backMatter: Section[]
): string => {
  let toc = "# Table of Contents\n\n";

  // Add front matter sections
  frontMatter.forEach((section, index) => {
    if (section.type !== 'table-of-contents') {
      toc += `${index + 1}. ${section.title}\n`;
    }
  });

  // Add chapters and their sections
  chapters.forEach((chapter, chapterIndex) => {
    toc += `${frontMatter.length + chapterIndex + 1}. ${chapter.title}\n`;
    chapter.sections.forEach((section, sectionIndex) => {
      toc += `   ${chapterIndex + 1}.${sectionIndex + 1}. ${section.title}\n`;
    });
  });

  // Add back matter sections
  backMatter.forEach((section, index) => {
    toc += `${frontMatter.length + chapters.length + index + 1}. ${section.title}\n`;
  });

  return toc;
};