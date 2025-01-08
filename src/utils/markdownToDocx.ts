import { Paragraph, TextRun, IParagraphOptions, AlignmentType, HeadingLevel } from 'docx';

export class MarkdownToDocx {
  convert(markdownText: string, font: string, fontSize: number): Paragraph[] {
    const paragraphs: Paragraph[] = [];
    const lines = markdownText.split(/\r?\n/);

    let inList = false;
    let listLevel = 0;
    let listType: 'unordered' | 'ordered' | null = null;
    let listItemCount = 0;

    for (let line of lines) {
      if (line.startsWith('# ')) {
        paragraphs.push(new Paragraph({
          text: line.substring(2),
          heading: HeadingLevel.HEADING_1,
          children: [
            new TextRun({
              text: line.substring(2),
              bold: true,
              font: font,
              size: fontSize + 2,
            })
          ]
        }));
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        if (!inList) {
          inList = true;
          listType = 'unordered';
          listItemCount = 1;
          listLevel = 1;
        }
        paragraphs.push(this.createListItem(line.substring(2), listType, listLevel, font, fontSize));
      } else if (line.match(/^[\d]+\.\s/)) {
        if (!inList) {
          inList = true;
          listType = 'ordered';
          listItemCount = 1;
          listLevel = 1;
        }
        paragraphs.push(this.createListItem(line.substring(line.indexOf('.') + 2), listType, listLevel, font, fontSize, listItemCount));
        listItemCount++;
      } else {
        if (inList) {
          inList = false;
          listType = null;
          listItemCount = 0;
          listLevel = 0;
        }
        paragraphs.push(new Paragraph({
          children: [
            new TextRun({
              text: line,
              font: font,
              size: fontSize
            })
          ]
        }));
      }
    }

    return paragraphs;
  }

  private createListItem(text: string, listType: 'unordered' | 'ordered' | null, level: number, font: string, fontSize: number, itemNumber?: number): Paragraph {
    const baseOptions: IParagraphOptions = {
      children: [
        new TextRun({
          text: text,
          font: font,
          size: fontSize
        })
      ],
    };

    if (listType === 'unordered') {
      return new Paragraph({
        ...baseOptions,
        bullet: {
          level: level - 1,
        }
      });
    }

    if (listType === 'ordered' && itemNumber) {
      return new Paragraph({
        ...baseOptions,
        numbering: {
          reference: "heading1",
          level: 0,
        },
        indent: { left: 200 * level }
      });
    }

    return new Paragraph({
      ...baseOptions
    });
  }
}