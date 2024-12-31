// import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// import {
//     Document,
//     Paragraph,
//     TextRun,
//     HeadingLevel,
//     TableOfContents,
//     Packer,
//   } from "npm:docx";

//   const corsHeaders = {
//     'Access-Control-Allow-Origin': '*',
//     'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
//   };

// serve(async (req) => {
//   // Handle CORS preflight requests
//   if (req.method === 'OPTIONS') {
//     return new Response(null, { headers: corsHeaders });
//   }

//   try {
//     console.log('Starting DOCX generation...');
//     const thesisData = await req.json();
//     console.log('Received thesis data:', JSON.stringify(thesisData));

//     const doc = generateThesisDocx(thesisData);
//     console.log('Document generated, packing...');

//     // Generate the blob
//     const buffer = await Packer.toBuffer(doc);
//     console.log('Document packed successfully');

//     return new Response(buffer, {
//       status: 200,
//       headers: {
//         ...corsHeaders,
//         "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//         'Content-Disposition': 'attachment; filename=thesis.docx',
//       },
//     });
//   } catch (error) {
//     console.error('Error generating docx:', error);
//     return new Response(
//       JSON.stringify({
//         error: error.message || 'Failed to generate document',
//         details: error
//       }),
//       {
//         status: 500,
//         headers: {
//           ...corsHeaders,
//           'Content-Type': 'application/json'
//         }
//       }
//     );
//   }
// });


// const generateThesisDocx = (thesis: {
//     frontMatter: any[];
//     chapters: any[];
//     backMatter: any[];
//     metadata?: {
//       universityName?: string;
//       departmentName?: string;
//       authorName?: string;
//       thesisDate?: string;
//       committeeMembers?: string[];
//     };
//   }) => {
//     console.log('Generating document structure...');

//     const titlePage = thesis.frontMatter.find(section => section.type === 'title');
//     const abstractPage = thesis.frontMatter.find(section => section.type === 'abstract');
//     const children = [];

//     // Add title page
//     if (titlePage) {
//       children.push(
//         new Paragraph({
//             text: titlePage.title,
//             heading: HeadingLevel.TITLE,
//             //spacing: { before: 3000, after: 400 },
//         }),
//       );

//       // Add metadata
//       if (thesis.metadata) {
//           if (thesis.metadata.universityName) {
//               children.push(
//                   new Paragraph({
//                       text: thesis.metadata.universityName,
//                       //spacing: { before: 400, after: 200 },
//                   })
//               );
//           }
//           if (thesis.metadata.departmentName) {
//               children.push(
//                   new Paragraph({
//                       text: thesis.metadata.departmentName,
//                       //spacing: { before: 200, after: 400 },
//                   })
//               );
//           }
//           if (thesis.metadata.authorName) {
//               children.push(
//                   new Paragraph({
//                     text: `By ${thesis.metadata.authorName}`,
//                       //spacing: { before: 400, after: 200 },
//                   })
//               );
//           }
//           if (thesis.metadata.thesisDate) {
//               children.push(
//                   new Paragraph({
//                       text: thesis.metadata.thesisDate,
//                       //spacing: { before: 200, after: 400 },
//                   })
//               );
//           }
//       }
//     }

//     // Add table of contents
//     children.push(
//       new TableOfContents("Table of Contents", {
//         hyperlink: true,
//         style: "Heading1-Heading5",
//       })
//     );

//     // Add abstract
//     if (abstractPage) {
//       children.push(
//         new Paragraph({
//           text: "Abstract",
//           heading: HeadingLevel.HEADING_1,
//           //spacing: { before: 400, after: 200 },
//         }),
//         new Paragraph({
//           children: [new TextRun(abstractPage.content)],
//           //spacing: { before: 200, after: 400 },
//         })
//       );
//     }

//     // Add chapters
//     thesis.chapters.forEach((chapter) => {
//         children.push(
//             new Paragraph({
//               text: chapter.title,
//               heading: HeadingLevel.HEADING_1,
//               //spacing: { before: 400, after: 200 },
//             })
//           );

//       chapter.sections.forEach((section) => {
//         children.push(
//           new Paragraph({
//             text: section.title,
//             heading: HeadingLevel.HEADING_2,
//             //spacing: { before: 200, after: 100 },
//           }),
//           new Paragraph({
//             children: [new TextRun(section.content)],
//             //spacing: { before: 100, after: 200 },
//           })
//         );
//       });
//     });

//     // Add back matter
//     thesis.backMatter.forEach((section) => {
//         children.push(
//             new Paragraph({
//               text: section.title,
//               heading: HeadingLevel.HEADING_1,
//               //spacing: { before: 400, after: 200 },
//             }),
//             new Paragraph({
//               children: [new TextRun(section.content)],
//               //spacing: { before: 200, after: 400 },
//             })
//           );
//     });

//     console.log('Document structure generated');

//     return new Document({
//         creator: "Thesis Generator",
//         title: "Thesis Document",
//       sections: [
//         {
//           properties: {},
//           children: children,
//         },
//       ],
//     });
//   };



import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
    Packer,
  } from "npm:docx";

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      console.log('Starting DOCX generation...');
      const thesisData = await req.json();
      console.log('Received thesis data:', JSON.stringify(thesisData));

      const doc = generateThesisDocx(thesisData);
      console.log('Document generated, packing...');

      // Generate the blob
      const buffer = await Packer.toBuffer(doc);
      console.log('Document packed successfully');

      return new Response(buffer, {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          'Content-Disposition': 'attachment; filename=thesis.docx',
        },
      });
    } catch (error) {
      console.error('Error generating docx:', error);
      return new Response(
        JSON.stringify({
          error: error.message || 'Failed to generate document',
          details: error
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }
  });



const generateThesisDocx = (thesis: {
  chapters: any[];
}) => {
  console.log('Generating document structure...');

  const children = [];

  // Add chapters
  thesis.chapters.forEach((chapter) => {
      children.push(
          new Paragraph({
            text: chapter.title,
            heading: HeadingLevel.HEADING_1,
          })
        );

      chapter.sections.forEach((section) => {
          children.push(
            new Paragraph({
              text: section.title,
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({
              children: [new TextRun(section.content)],
            })
          );
        });
  });

  console.log('Document structure generated');

  return new Document({
    creator: "Thesis Generator",
    title: "Thesis Document",
    sections: [
      {
        properties: {},
        children: children,
      },
    ],
  });
};