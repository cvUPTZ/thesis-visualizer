import { Document, Paragraph, TextRun, PageBreak, Header, Footer, AlignmentType, LevelFormat, HeadingLevel, PageNumber, NumberFormat, TableOfContents,  TableOfContentsOptions,  } from 'docx';
import { Thesis, Section, Chapter } from '@/types/thesis';

const createHeader = () => {
  return new Header({
    children: [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({
            children: ["Running head: ", PageNumber.CURRENT],
            font: "Times New Roman",
            size: 24, // 12pt
          }),
        ],
      }),
    ],
  });
};

const createFooter = () => {
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            children: [PageNumber.CURRENT],
            font: "Times New Roman",
            size: 24, // 12pt
          }),
        ],
      }),
    ],
  });
};

const createTitlePage = (thesis: Thesis) => {
    console.log('Creating title page with metadata:', thesis.metadata);
  const titleSection = thesis.frontMatter.find(section => section.type === 'title');
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 1440, after: 1440 }, // 1 inch margins
      children: [
        new TextRun({
          text: titleSection?.title || "Untitled Thesis",
          bold: true,
          font: "Times New Roman",
          size: 32, // 16pt
        }),
      ],
    }),
      new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 360, after: 360 },
          children: [
              new TextRun({
                  text: thesis.metadata?.universityName || "Your University Name",
                  font: "Times New Roman",
                  size: 24,
              }),
          ],
      }),
      new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 360, after: 360 },
          children: [
              new TextRun({
                  text: thesis.metadata?.departmentName || "Department of Your Field",
                  font: "Times New Roman",
                  size: 24,
              }),
          ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 1440, after: 1440 }, // 1 inch margins
        children: [
          new TextRun({
            text: titleSection?.content || "Untitled Thesis",
            font: "Times New Roman",
            size: 32, // 16pt
          }),
        ],
      }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 360, after: 360 },
            children: [
                new TextRun({
                    text: "A thesis submitted in partial fulfillment\n of the requirements for the degree of\n Doctor of Philosophy",
                    font: "Times New Roman",
                    size: 24,
                }),
            ],
        }),
       new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 360, after: 360 },
            children: [
                new TextRun({
                    text: `by\n ${thesis.metadata?.authorName || "Author Name"}`,
                  font: "Times New Roman",
                  size: 24,
                }),
            ],
        }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 360, after: 360 },
            children: [
              new TextRun({
                text: thesis.metadata?.thesisDate || "Month Year",
                font: "Times New Roman",
                size: 24, // 12pt
              }),
            ],
          }),
    new Paragraph({
            alignment: AlignmentType.CENTER,
          spacing: { before: 360, after: 360 },
        children: [
            new TextRun({
              text: `Thesis Committee: \n`,
                font: "Times New Roman",
                size: 24, // 12pt
            }),
          ],
        }),
      ...thesis.metadata?.committeeMembers?.map((member, index) => (
          new Paragraph({
            alignment: AlignmentType.CENTER,
             spacing: { before: 360, after: 360 },
            children: [
                new TextRun({
                    text: `${member || ""} ${index ===0 ? "(Chair)" : ""}\n`,
                    font: "Times New Roman",
                    size: 24,
                }),
            ],
        })
          
      )) || [],
    new Paragraph({
      children: [new PageBreak()],
    }),
  ];
};

const createAbstract = (thesis: Thesis) => {
    console.log("Creating Abstract")
  return [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: "Abstract",
          bold: true,
          font: "Times New Roman",
          size: 24, // 12pt
        }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: thesis.metadata?.description || "",
          font: "Times New Roman",
          size: 24, // 12pt
        }),
      ],
    }),
    new Paragraph({
      children: [new PageBreak()],
    }),
  ];
};

const createTableOfContents = () => {
    console.log('Creating table of contents')
  return [
        new Paragraph({
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                text: "Table of Contents",
                bold: true,
                font: "Times New Roman",
                size: 24,
                }),
            ],
        }),
         new Paragraph({
            children: [
              new TableOfContents({
                options: {
                    headingStyleRange: "1-3",
                    
                } as TableOfContentsOptions,
              }),
            ]
        }),
    new Paragraph({
      children: [new PageBreak()],
    }),
  ];
};


const createReferences = (thesis: Thesis) => {
    console.log('Creating References');
     const referencesSection = thesis.backMatter.find(section => section.type === 'references');

     if(!referencesSection) {
        return []
    }
   return [
         new Paragraph({
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: "References",
              bold: true,
              font: "Times New Roman",
              size: 24,
            }),
          ],
         }),
         new Paragraph({
           children: [
             new TextRun({
               text: referencesSection.content || "",
                font: "Times New Roman",
                size: 24,
             }),
           ],
        }),
        new Paragraph({
        children: [new PageBreak()],
        }),
   ]
}

const createChapterContent = (chapter: Chapter) => {
  console.log(`Creating chapter content for: ${chapter.title}`);
  const paragraphs: Paragraph[] = [
    new Paragraph({
      children: [new PageBreak()], // Chapter break here
    }),
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [
        new TextRun({
          text: chapter.title,
          bold: true,
          font: "Times New Roman",
          size: 28, // 14pt
        }),
      ],
    }),
  ];

  chapter.sections.forEach(section => {
    console.log(`Creating section: ${section.title}`);
      paragraphs.push(
         new Paragraph({
              heading: HeadingLevel.HEADING_2,
              children: [
                new TextRun({
                  text: section.title,
                  bold: true,
                  font: "Times New Roman",
                  size: 24,
                }),
              ],
          }),
        new Paragraph({
            children: [
                new TextRun({
                    text: section.content,
                    font: "Times New Roman",
                    size: 24,
                }),
            ],
        })
     );
   });


  return paragraphs;
};

export const generateThesisDocx = (thesis: Thesis): Document => {
    console.log('Generating DOCX document with thesis:', thesis);
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch in twips
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        headers: {
          default: createHeader(),
        },
        footers: {
          default: createFooter(),
        },
        children: [
            ...createTitlePage(thesis),
            ...createAbstract(thesis),
            ...createTableOfContents(),
           ...thesis.chapters.flatMap(chapter => createChapterContent(chapter)),
          ...createReferences(thesis)
        ],
      },
    ],
    numbering: {
      config: [
        {
          reference: "heading1",
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: "%1.",
              alignment: AlignmentType.LEFT,
            },
          ],
        },
          {
              reference: "heading2",
              levels: [
                  {
                      level: 0,
                      format: LevelFormat.DECIMAL,
                      text: "%1.%2.",
                      alignment: AlignmentType.LEFT,
                  },
              ],
          },
      ],
    },
  });

  return doc;
};