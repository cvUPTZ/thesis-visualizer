// File: src/utils/docxExport.ts

import {
  Document,
  Header,
  Footer,
  PageBreak,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  PageNumber,
  ISectionPropertiesOptions,
  convertInchesToTwip,
  Section as DocxSection,
} from 'docx';
import { documentStyles, mainPageSettings, preliminaryPageSettings } from './docx/documentStyles';
import { generateTitlePage, generateAbstractSection, generateChapterContent, generateTableOfContents } from './docx/sectionGenerators';
import { Thesis } from '@/types/thesis';
import { createImageRun } from './docx/imageUtils';

const createHeader = (thesis: Thesis) => {
    return new Header({
      children: [
        new Paragraph({
            border: {
              bottom: {
                color: "000000",
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6,
              },
            },
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: thesis.metadata?.shortTitle || "Running head",
                font: "Times New Roman",
                size: 24
              }),
              new TextRun({ text: "\t" }),
              new TextRun({
                text: String(PageNumber.CURRENT),
                font: "Times New Roman",
                size: 24
              })
            ],
        }),
      ],
    });
  };
  
  const createFooter = () => {
    return new Footer({
      children: [
        new Paragraph({
          border: {
            top: {
              color: "000000",
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
          spacing: { before: 200 },
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: String(PageNumber.CURRENT),
              font: "Times New Roman",
              size: 24
            })
          ],
        }),
      ],
    });
  };

export const generateThesisDocx = async (thesis: Thesis) => {
    // Check if Buffer is defined before using it
    if (typeof Buffer === 'undefined') {
      // Dynamically create buffer object for browser env
      (window as any).Buffer = (await import('buffer')).Buffer;
    }
  const titleSection = thesis.frontMatter.find(section => section.type === 'title');
  const abstractSection = thesis.frontMatter.find(section => section.type === 'abstract');
  
    const tocSections = [
      ...thesis.frontMatter.map(section => ({
        title: section.title,
        page: 0
      })),
      ...thesis.chapters.map((chapter, index) => ({
        title: `Chapter ${index + 1}: ${chapter.title}`,
        page: 0
      }))
    ];

  const doc = new Document({
    styles: documentStyles,
    sections: [
       {
         properties: {
           ...preliminaryPageSettings.properties,
           page: {
              ...preliminaryPageSettings.properties?.page,
              borders: {
                top: { style: BorderStyle.SINGLE, size: 4, color: '#000000' },
                right: { style: BorderStyle.SINGLE, size: 4, color: '#000000' },
                bottom: { style: BorderStyle.SINGLE, size: 4, color: '#000000' },
                left: { style: BorderStyle.SINGLE, size: 4, color: '#000000' },
              },
            }
          },
          headers: {
            default: createHeader(thesis),
          },
          footers: {
            default: createFooter(),
          },
        children: [
          ...generateTitlePage({
            title: titleSection?.title || thesis.title,
            author: thesis.metadata?.authorName || '',
            date: thesis.metadata?.thesisDate || new Date().getFullYear().toString(),
            university: thesis.metadata?.universityName,
            department: thesis.metadata?.departmentName,
            degree: thesis.metadata?.degree
           }),
           ...generateTableOfContents(tocSections),
            ...(abstractSection ? generateAbstractSection(abstractSection.content) : []),
         ]
      },
       {
         properties: {
           ...mainPageSettings.properties,
            page: {
              ...mainPageSettings.properties?.page,
              borders: {
                top: { style: BorderStyle.SINGLE, size: 4, color: '#000000' },
                right: { style: BorderStyle.SINGLE, size: 4, color: '#000000' },
                bottom: { style: BorderStyle.SINGLE, size: 4, color: '#000000' },
                left: { style: BorderStyle.SINGLE, size: 4, color: '#000000' },
              }
            }
          },
        headers: {
            default: createHeader(thesis),
        },
        footers: {
          default: createFooter(),
        },
          children: [
            ...thesis.chapters.flatMap((chapter, index) => {
              return [
                ...generateChapterContent(
                  index + 1,
                  chapter.title,
                  chapter.content || ''
                ),
                  ...chapter.sections.flatMap((section) => {
                    const sectionParagraphs = section.content.split('\n').map(paragraphText => 
                      new Paragraph({
                        text: paragraphText,
                        font: "Times New Roman",
                        size: 24,
                       
                      })
                    );
              
                    return [
                       ...sectionParagraphs,
                       ...(section.figures || []).map(figure => new Paragraph({
                         children: [
                          new TextRun({ text: `${figure.title}\n`}),
                          new TextRun({
                            children: [
                             ...(figure.imageUrl
                                ? [createImageRun(Buffer.from(figure.imageUrl.split(',')[1], 'base64'), figure.dimensions.width/3, figure.dimensions.height/3) as any]
                                : []
                            )
                           ]
                         }),
                         new TextRun({
                             text: figure.caption,
                             size: 20
                           })
                          ],
                         alignment: AlignmentType.CENTER
                       })),
                      
                       ...(section.tables || []).map(table => 
                        new Paragraph({
                          text: `Table ${table.id} : ${table.caption}`,
                          size: 20,
                          font: "Times New Roman",
                          alignment: AlignmentType.CENTER
                        }),
                       ),
                    ];
                  }),
                new Paragraph({ children: [new PageBreak()] }),
              ];
            }),
          ],
        }
    ]
  });

  return doc;
};