import { 
  Document, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  AlignmentType, 
  TableOfContents,
  StyleLevel,
  convertInchesToTwip,
  ImageRun,
  IImageOptions
} from 'docx';
import { ContentGenerationOptions } from './types';
import { defaultStyles, previewStyles } from './styleConfig';
import { convertImageToBase64 } from './imageUtils';

export const generateTableOfContents = (): TableOfContents => {
  return new TableOfContents("Table of Contents", {
    hyperlink: true,
    headingStyleRange: "1-5",
    stylesWithLevels: [
      {
        level: 1,
        styleName: "heading 1",
      } as StyleLevel,
      {
        level: 2,
        styleName: "heading 2",
      } as StyleLevel,
    ],
  });
};

const generateHeader = (title: string): Paragraph => {
  return new Paragraph({
    children: [
      new TextRun({
        text: title,
        size: 20,
        font: "Times New Roman",
      }),
    ],
    alignment: AlignmentType.CENTER,
    style: 'header',
  });
};

const generateFooter = (): Paragraph => {
  return new Paragraph({
    children: [
      new TextRun("Page "),
      new TextRun({
        children: ["PAGE"],
      }),
      new TextRun(" of "),
      new TextRun({
        children: ["NUMPAGES"],
      }),
    ],
    alignment: AlignmentType.CENTER,
    style: 'footer',
  });
};

const generateListOfFigures = (thesis: any): Paragraph[] => {
  const paragraphs: Paragraph[] = [
    new Paragraph({
      text: "List of Figures",
      heading: HeadingLevel.HEADING_1,
      pageBreakBefore: true,
      spacing: { before: convertInchesToTwip(2), after: convertInchesToTwip(1) },
    })
  ];

  let figureNumber = 1;
  thesis.chapters.forEach((chapter: any) => {
    if (chapter.figures && chapter.figures.length > 0) {
      chapter.figures.forEach((figure: any) => {
        paragraphs.push(
          new Paragraph({
            text: `Figure ${figureNumber}: ${figure.caption}`,
            spacing: { before: convertInchesToTwip(0.25), after: convertInchesToTwip(0.25) },
            style: 'listItem'
          })
        );
        figureNumber++;
      });
    }
  });

  return paragraphs;
};

const generateListOfTables = (thesis: any): Paragraph[] => {
  const paragraphs: Paragraph[] = [
    new Paragraph({
      text: "List of Tables",
      heading: HeadingLevel.HEADING_1,
      pageBreakBefore: true,
      spacing: { before: convertInchesToTwip(2), after: convertInchesToTwip(1) },
    })
  ];

  let tableNumber = 1;
  thesis.chapters.forEach((chapter: any) => {
    if (chapter.tables && chapter.tables.length > 0) {
      chapter.tables.forEach((table: any) => {
        paragraphs.push(
          new Paragraph({
            text: `Table ${tableNumber}: ${table.caption || table.title}`,
            spacing: { before: convertInchesToTwip(0.25), after: convertInchesToTwip(0.25) },
            style: 'listItem'
          })
        );
        tableNumber++;
      });
    }
  });

  return paragraphs;
};

const generateFigure = async (figure: any, figureNumber: number): Promise<Paragraph[]> => {
  const paragraphs: Paragraph[] = [];
  try {
    if (figure.url) {
      const base64Image = await convertImageToBase64(figure.url);
      
      // Calculate image dimensions while maintaining aspect ratio
      const maxWidth = convertInchesToTwip(6); // 6 inches max width
      const aspectRatio = figure.dimensions.height / figure.dimensions.width;
      const width = Math.min(figure.dimensions.width, maxWidth);
      const height = width * aspectRatio;

      paragraphs.push(
        new Paragraph({
          children: [
            new ImageRun({
              data: base64Image,
              transformation: {
                width,
                height
              },
              type: 'png',
              fallback: {
                type: 'png',
                width,
                height
              }
            } as IImageOptions)
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: convertInchesToTwip(0.5), after: convertInchesToTwip(0.25) }
        }),
        new Paragraph({
          text: `Figure ${figureNumber}: ${figure.caption}`,
          alignment: AlignmentType.CENTER,
          style: 'caption',
          spacing: { before: convertInchesToTwip(0.25), after: convertInchesToTwip(0.5) }
        })
      );
    }
  } catch (error) {
    console.error('Error generating figure:', error);
    paragraphs.push(
      new Paragraph({
        text: `[Figure ${figureNumber}: ${figure.caption}] - Image could not be loaded`,
        alignment: AlignmentType.CENTER,
        style: 'caption'
      })
    );
  }
  return paragraphs;
};

const generateReferences = (references: any[]): Paragraph[] => {
  const paragraphs: Paragraph[] = [
    new Paragraph({
      text: "References",
      heading: HeadingLevel.HEADING_1,
      pageBreakBefore: true,
      spacing: { before: convertInchesToTwip(2), after: convertInchesToTwip(1) },
    })
  ];

  references.sort((a, b) => {
    // Sort by first author's last name
    const aName = a.authors[0]?.split(' ').pop() || '';
    const bName = b.authors[0]?.split(' ').pop() || '';
    return aName.localeCompare(bName);
  });

  references.forEach(ref => {
    let referenceText = '';
    
    // Format based on reference type
    switch (ref.type) {
      case 'article':
        referenceText = `${ref.authors.join(', ')} (${ref.year}). ${ref.title}. ${ref.journal}`;
        if (ref.volume) referenceText += `, ${ref.volume}`;
        if (ref.issue) referenceText += `(${ref.issue})`;
        if (ref.pages) referenceText += `, ${ref.pages}`;
        if (ref.doi) referenceText += `. DOI: ${ref.doi}`;
        break;
        
      case 'book':
        referenceText = `${ref.authors.join(', ')} (${ref.year}). ${ref.title}`;
        if (ref.publisher) referenceText += `. ${ref.publisher}`;
        break;
        
      case 'conference':
        referenceText = `${ref.authors.join(', ')} (${ref.year}). ${ref.title}. In ${ref.source}`;
        if (ref.pages) referenceText += `, ${ref.pages}`;
        break;
        
      default:
        referenceText = `${ref.authors.join(', ')} (${ref.year}). ${ref.title}`;
        if (ref.url) referenceText += `. Retrieved from ${ref.url}`;
    }

    paragraphs.push(
      new Paragraph({
        text: referenceText,
        style: 'reference',
        spacing: { before: convertInchesToTwip(0.25), after: convertInchesToTwip(0.25) },
        indent: { leftChars: 36 }
      })
    );
  });

  return paragraphs;
};

export const generateContent = async ({ thesis, isPreview = false }: ContentGenerationOptions): Promise<Paragraph[]> => {
  const paragraphs: Paragraph[] = [];
  const styles = isPreview ? previewStyles : defaultStyles;

  // Add List of Figures if there are any
  if (thesis.chapters.some(chapter => chapter.figures?.length > 0)) {
    paragraphs.push(...generateListOfFigures(thesis));
  }

  // Front Matter
  if (Array.isArray(thesis.frontMatter)) {
    for (const section of thesis.frontMatter) {
      paragraphs.push(
        new Paragraph({
          text: section.title,
          heading: HeadingLevel.HEADING_1,
          pageBreakBefore: true,
        })
      );

      if (section.content) {
        paragraphs.push(
          new Paragraph({
            text: section.content,
            style: 'Normal',
            spacing: { before: convertInchesToTwip(0.5), after: convertInchesToTwip(1) },
          })
        );
      }
    }
  }

  let figureNumber = 1;
  // Chapters with figures
  if (Array.isArray(thesis.chapters)) {
    for (const chapter of thesis.chapters) {
      if (chapter.title) {
        paragraphs.push(
          new Paragraph({
            text: chapter.title,
            heading: HeadingLevel.HEADING_1,
            pageBreakBefore: true,
          })
        );
      }

      if (chapter.content) {
        paragraphs.push(
          new Paragraph({
            text: chapter.content,
            style: 'Normal',
            spacing: { before: convertInchesToTwip(0.5), after: convertInchesToTwip(1) },
          })
        );
      }

      // Add figures
      if (Array.isArray(chapter.figures)) {
        for (const figure of chapter.figures) {
          const figureParagraphs = await generateFigure(figure, figureNumber);
          paragraphs.push(...figureParagraphs);
          figureNumber++;
        }
      }
    }
  }

  // Back Matter (including references)
  if (Array.isArray(thesis.backMatter)) {
    for (const section of thesis.backMatter) {
      if (section.type === 'references' && section.references) {
        paragraphs.push(...generateReferences(section.references));
      } else {
        paragraphs.push(
          new Paragraph({
            text: section.title,
            heading: HeadingLevel.HEADING_1,
            pageBreakBefore: true,
          }),
          new Paragraph({
            text: section.content,
            style: 'Normal',
            spacing: { before: convertInchesToTwip(0.5), after: convertInchesToTwip(1) },
          })
        );
      }
    }
  }

  return paragraphs;
};