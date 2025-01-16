import { 
  Document, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  AlignmentType, 
  TableOfContents, 
  StyleLevel,
  convertInchesToTwip
} from 'docx';
import { ContentGenerationOptions } from './types';
import { defaultStyles, previewStyles } from './styleConfig';

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

const generateChapterSeparator = (chapterTitle: string, chapterContent?: string): Paragraph[] => {
  const paragraphs = [
    new Paragraph({
      children: [new TextRun({ break: 1 })],
      pageBreakBefore: true,
    }),
    new Paragraph({
      text: chapterTitle,
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { before: convertInchesToTwip(2), after: convertInchesToTwip(1) },
      style: 'chapterTitle',
    }),
  ];

  // Add chapter introduction if available
  if (chapterContent) {
    paragraphs.push(
      new Paragraph({
        text: chapterContent,
        style: 'Normal',
        spacing: { before: convertInchesToTwip(0.5), after: convertInchesToTwip(1) },
      })
    );
  }

  return paragraphs;
};

const generateFootnote = (footnote: any): Paragraph => {
  return new Paragraph({
    text: `${footnote.number}. ${footnote.content}`,
    style: 'footnote',
    spacing: { before: convertInchesToTwip(0.25), after: convertInchesToTwip(0.25) },
  });
};

export const generateContent = ({ thesis, isPreview = false }: ContentGenerationOptions): Paragraph[] => {
  const paragraphs: Paragraph[] = [];
  const styles = isPreview ? previewStyles : defaultStyles;

  // Front Matter with proper spacing and styling
  thesis.frontMatter.forEach(section => {
    if (section.type !== 'title') {
      paragraphs.push(
        new Paragraph({
          text: section.title,
          heading: HeadingLevel.HEADING_1,
          style: 'heading 1',
          pageBreakBefore: true,
        }),
        new Paragraph({
          text: section.content,
          spacing: styles.default.document.paragraph.spacing,
          style: 'Normal',
        })
      );
    }
  });

  // Chapters with proper formatting and separation pages
  thesis.chapters.forEach(chapter => {
    // Add chapter separator page with introduction
    paragraphs.push(...generateChapterSeparator(chapter.title, chapter.content));

    chapter.sections.forEach(section => {
      paragraphs.push(
        new Paragraph({
          text: section.title,
          heading: HeadingLevel.HEADING_2,
          spacing: styles.default.heading2.paragraph.spacing,
          style: 'heading 2',
        })
      );

      const contentParagraphs = section.content.split('\n\n');
      contentParagraphs.forEach(content => {
        if (content.trim()) {
          paragraphs.push(
            new Paragraph({
              text: content,
              spacing: styles.default.document.paragraph.spacing,
              style: 'Normal',
            })
          );
        }
      });

      // Add footnotes if available
      if (section.footnotes && section.footnotes.length > 0) {
        paragraphs.push(
          new Paragraph({
            text: 'Footnotes',
            style: 'heading 3',
            spacing: { before: convertInchesToTwip(1), after: convertInchesToTwip(0.5) },
          })
        );
        section.footnotes.forEach(footnote => {
          paragraphs.push(generateFootnote(footnote));
        });
      }

      // Handle figures with captions
      if (section.figures && section.figures.length > 0) {
        section.figures.forEach(figure => {
          paragraphs.push(
            new Paragraph({
              text: `[Figure ${figure.number}]`,
              spacing: { before: 240, after: 120 },
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              text: figure.caption,
              style: isPreview ? 'preview-caption' : 'caption',
              spacing: { before: 120, after: 240 },
            })
          );
        });
      }

      // Handle tables with captions
      if (section.tables && section.tables.length > 0) {
        section.tables.forEach(table => {
          paragraphs.push(
            new Paragraph({
              text: table.content,
              spacing: { before: 240, after: 120 },
            }),
            new Paragraph({
              text: `Table ${table.id}: ${table.caption}`,
              style: isPreview ? 'preview-caption' : 'caption',
              spacing: { before: 120, after: 240 },
            })
          );
        });
      }
    });
  });

  // Back Matter
  thesis.backMatter.forEach(section => {
    paragraphs.push(
      new Paragraph({
        text: section.title,
        heading: HeadingLevel.HEADING_1,
        pageBreakBefore: true,
        spacing: styles.default.heading1.paragraph.spacing,
        style: 'heading 1',
      }),
      new Paragraph({
        text: section.content,
        spacing: styles.default.document.paragraph.spacing,
        style: 'Normal',
      })
    );
  });

  return paragraphs;
};
