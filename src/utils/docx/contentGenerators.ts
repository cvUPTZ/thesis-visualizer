import { Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { Section, Citation, Table as ThesisTable } from '@/types/thesis';
import { generateFigures } from './imageUtils';

export const generateTable = (table: ThesisTable): string | null => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(table.content, 'text/html');
    const htmlTable = doc.querySelector('table');
    
    if (!htmlTable) {
      console.warn('Invalid table content:', table);
      return null;
    }

    return htmlTable.textContent || null;
  } catch (error) {
    console.error('Error generating table:', error);
    return null;
  }
};

export const generateCitations = (citations: Citation[]) => {
  return citations.map((citation) => {
    let citationText = `${citation.authors.join(', ')} (${citation.year}). ${citation.text}`;
    if (citation.journal) citationText += ` ${citation.journal}.`;
    if (citation.doi) citationText += ` DOI: ${citation.doi}`;

    return new Paragraph({
      text: citationText,
      style: "Normal",
      spacing: {
        before: 240,
        after: 240,
      },
    });
  });
};

export const generateSectionContent = async (sections: Section[]) => {
  const content: Paragraph[] = [];
  
  for (const section of sections) {
    content.push(
      new Paragraph({
        text: section.title,
        heading: HeadingLevel.HEADING_1,
        pageBreakBefore: true,
      }),
      new Paragraph({
        children: [new TextRun(section.content)],
      })
    );

    if (section.figures?.length) {
      const figureContent = await generateFigures(section.figures);
      content.push(...figureContent);
    }

    if (section.tables?.length) {
      section.tables.forEach(table => {
        const tableContent = generateTable(table);
        if (tableContent) {
          content.push(
            new Paragraph({
              text: tableContent,
              spacing: {
                before: 240,
                after: 0,
              },
            })
          );
          if (table.caption) {
            content.push(
              new Paragraph({
                text: `Table ${table.id}: ${table.caption}`,
                alignment: AlignmentType.CENTER,
                spacing: {
                  before: 240,
                  after: 240,
                },
              })
            );
          }
        }
      });
    }

    if (section.citations?.length) {
      content.push(...generateCitations(section.citations));
    }
  }

  return content;
};

export const generateChapterContent = async (chapters: any[]) => {
  const content: Paragraph[] = [];

  for (const chapter of chapters) {
    content.push(
      new Paragraph({
        text: chapter.title,
        heading: HeadingLevel.HEADING_1,
        pageBreakBefore: true,
      })
    );

    for (const section of chapter.sections) {
      content.push(
        new Paragraph({
          text: section.title,
          heading: HeadingLevel.HEADING_2,
        }),
        new Paragraph({
          children: [new TextRun(section.content)],
        })
      );

      if (section.figures?.length) {
        const figureContent = await generateFigures(section.figures);
        content.push(...figureContent);
      }

      if (section.tables?.length) {
        section.tables.forEach(table => {
          const tableContent = generateTable(table);
          content.push(
            new Paragraph({
              text: tableContent || '',
              spacing: {
                before: 240,
                after: 0,
              },
            })
          );
          if (table.caption) {
            content.push(
              new Paragraph({
                text: `Table ${table.id}: ${table.caption}`,
                alignment: AlignmentType.CENTER,
                spacing: {
                  before: 240,
                  after: 240,
                },
              })
            );
          }
        });
      }

      if (section.citations?.length) {
        content.push(...generateCitations(section.citations));
      }
    }
  }

  return content;
};