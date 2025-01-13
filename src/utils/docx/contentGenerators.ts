import { 
  HeadingLevel, 
  IParagraphOptions,
  convertInchesToTwip, 
  AlignmentType, 
  Paragraph, 
  TextRun, 
  TabStopPosition,
  TabStopType,
    ImageRun,
  WidthType,
  BorderStyle
} from 'docx';
import { base64ToUint8Array } from './imageUtils';


export const createHeading = (text: string, level: keyof typeof HeadingLevel, chapterNumber?: number): IParagraphOptions => ({
  text: chapterNumber ? `CHAPTER ${chapterNumber}\n${text}` : text,
  heading: HeadingLevel[level],
  spacing: {
    before: 480,
    after: 240
  },
    alignment: AlignmentType.CENTER
});

export const createParagraph = (text: string, options?: Partial<IParagraphOptions>): IParagraphOptions => ({
  ...options,
  children: [
    new TextRun({
      text,
      size: 24, // 12pt
      font: "Times New Roman"
    })
  ],
  spacing: {
    line: 360, // 1.5 spacing
    before: 0,
    after: 0,
    ...options?.spacing
  },
  indent: {
    firstLine: convertInchesToTwip(0.5),
    ...options?.indent
  }
});

export const createBlockQuote = (text: string): IParagraphOptions => ({
  children: [
    new TextRun({
      text,
      size: 24,
      font: "Times New Roman"
    })
  ],
  spacing: {
    line: 240, // single spacing
    before: 240,
    after: 240
  },
  indent: {
    left: convertInchesToTwip(0.5),
    right: convertInchesToTwip(0.5)
  }
});

export const createCaption = (text: string, type: 'figure' | 'table', number: string): IParagraphOptions => ({
  children: [
    new TextRun({
      text: `${type === 'figure' ? 'Figure' : 'Table'} ${number}: ${text}`,
      size: 20, // 10pt
      font: "Times New Roman"
    })
  ],
  spacing: {
    line: 240, // single spacing
    before: 120,
    after: 120
  },
  alignment: AlignmentType.CENTER
});


export const generateChapterContent = (
    chapterNumber: number,
    title: string,
    content: string,
    figures: any[],
): Paragraph[] => {
    const paragraphs: Paragraph[] = [
      new Paragraph({
        children: [
          new TextRun({
            text: `CHAPTER ${chapterNumber}`,
            bold: true,
            size: 32
          }),
        ],
        pageBreakBefore: true,
        alignment: AlignmentType.LEFT,
      }),
    new Paragraph({
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: 32
        }),
      ],
        alignment: AlignmentType.LEFT,
    }),
  ];
  if (typeof content === 'string') {
    content.split('\n\n').forEach(paragraph => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: paragraph.trim(),
              size: 24
            }),
          ],
          alignment: AlignmentType.LEFT,
        })
      );
    });
    }

      if (figures && figures.length > 0) {
            figures.forEach(figure => {
              if (figure.imageUrl) {
                try {
                  // Extract base64 data from data URL
                   const base64Data = figure.imageUrl.split(',')[1];
                   if (!base64Data) {
                    console.warn('Invalid image URL format:', figure.imageUrl);
                      return;
                   }
                   const imageBuffer = base64ToUint8Array(base64Data);

                  const imageRun = new ImageRun({
                     data: imageBuffer,
                    transformation: {
                      width: figure.dimensions?.width || 400,
                      height: figure.dimensions?.height || 300
                    }
                 });
           
                 paragraphs.push(
                      new Paragraph({
                        children: [imageRun],
                           alignment: figure.position === 'left' ? AlignmentType.LEFT :
                              figure.position === 'right' ? AlignmentType.RIGHT :
                                AlignmentType.CENTER
                      }),
                     new Paragraph({
                         children: [
                             new TextRun({
                                 text: `Figure ${figure.number}: ${figure.caption || ''}`,
                                 italics: true,
                                 size: 20
                             })
                         ],
                         alignment: AlignmentType.CENTER
                    })
               );
                } catch (error) {
                    console.error('Error processing figure:', error);
                }
             }
          });
        }

    return paragraphs;
};