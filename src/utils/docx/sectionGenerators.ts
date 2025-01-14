import { 
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  convertInchesToTwip,
  IParagraphOptions,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle
} from 'docx';
import { Chapter, Section } from '@/types/thesis';

interface TitlePageOptions {
  title: string;
  author: string;
  date: string;
  university: string;
  department: string;
  degree: string;
}

export const generateTitlePage = (options: TitlePageOptions): Paragraph[] => {
  return [
    new Paragraph({
      children: [
        new TextRun({
          text: options.university,
          bold: true,
          size: 32
        })
      ],
      spacing: { before: convertInchesToTwip(2) },
      alignment: AlignmentType.CENTER
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: options.department,
          size: 28
        })
      ],
      spacing: { before: convertInchesToTwip(0.5) },
      alignment: AlignmentType.CENTER
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: options.title,
          bold: true,
          size: 36
        })
      ],
      spacing: { before: convertInchesToTwip(2) },
      alignment: AlignmentType.CENTER
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `A thesis submitted for the degree of ${options.degree}`,
          size: 24
        })
      ],
      spacing: { before: convertInchesToTwip(1) },
      alignment: AlignmentType.CENTER
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `by`,
          size: 24
        })
      ],
      spacing: { before: convertInchesToTwip(1) },
      alignment: AlignmentType.CENTER
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: options.author,
          bold: true,
          size: 28
        })
      ],
      spacing: { before: convertInchesToTwip(0.5) },
      alignment: AlignmentType.CENTER
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: options.date,
          size: 24
        })
      ],
      spacing: { before: convertInchesToTwip(1) },
      alignment: AlignmentType.CENTER
    })
  ];
};

export const generateTableOfContents = (chapters: { title: string; page: number }[]): Paragraph[] => {
  return [
    new Paragraph({
      children: [
        new TextRun({
          text: 'Table of Contents',
          bold: true,
          size: 28
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: convertInchesToTwip(0.5) }
    }),
    ...chapters.map(chapter => new Paragraph({
      children: [
        new TextRun({
          text: chapter.title,
          size: 24
        }),
        new TextRun({
          text: `${chapter.page}`,
          size: 24
        })
      ],
      alignment: AlignmentType.LEFT,
      spacing: { after: convertInchesToTwip(0.25) }
    }))
  ];
};

export const createHeading = (text: string, level: keyof typeof HeadingLevel): Paragraph => {
  return new Paragraph({
    text,
    heading: HeadingLevel[level],
    spacing: { before: 480, after: 240 },
    alignment: AlignmentType.CENTER
  });
};

export const createParagraph = (text: string, options?: Partial<IParagraphOptions>): Paragraph => {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        size: 24,
        font: "Times New Roman"
      })
    ],
    spacing: {
      line: 360,
      before: 0,
      after: 0,
      ...options?.spacing
    },
    alignment: options?.alignment || AlignmentType.LEFT
  });
};

export const generateChapterContent = (
  chapterNumber: number,
  title: string,
  content: string,
  figures: any[] = []
): Paragraph[] => {
  const paragraphs: Paragraph[] = [
    createHeading(`Chapter ${chapterNumber}`, 'HEADING_1'),
    createHeading(title, 'HEADING_2')
  ];

  if (content) {
    content.split('\n\n').forEach(paragraph => {
      paragraphs.push(createParagraph(paragraph.trim()));
    });
  }

  if (figures && figures.length > 0) {
    figures.forEach(figure => {
      if (figure.caption) {
        paragraphs.push(createParagraph(figure.caption, {
          alignment: AlignmentType.CENTER,
          spacing: { before: 240, after: 240 }
        }));
      }
    });
  }

  return paragraphs;
};