import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Document, Paragraph, TextRun, HeadingLevel, Packer, SectionType, Header, Footer, AlignmentType } from "npm:docx";

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

    const children = [];

    // Add title page
    const titleSection = thesisData.frontMatter.find((section: any) => section.type === 'title');
    if (titleSection) {
      children.push(
        new Paragraph({
          text: titleSection.title,
          heading: HeadingLevel.TITLE,
          spacing: { before: 3000, after: 400 },
          alignment: AlignmentType.CENTER,
        })
      );

      // Add metadata
      if (thesisData.metadata) {
        if (thesisData.metadata.universityName) {
          children.push(
            new Paragraph({
              text: thesisData.metadata.universityName,
              spacing: { before: 400, after: 200 },
              alignment: AlignmentType.CENTER,
            })
          );
        }
        if (thesisData.metadata.departmentName) {
          children.push(
            new Paragraph({
              text: thesisData.metadata.departmentName,
              spacing: { before: 200, after: 400 },
              alignment: AlignmentType.CENTER,
            })
          );
        }

        children.push(
          new Paragraph({
            text: "A thesis submitted in partial fulfillment of the requirements for the degree of",
            spacing: { before: 400, after: 200 },
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: "Doctor of Philosophy",
            spacing: { before: 200, after: 400 },
            alignment: AlignmentType.CENTER,
          })
        );

        if (thesisData.metadata.authorName) {
          children.push(
            new Paragraph({
              text: "by",
              spacing: { before: 400, after: 200 },
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              text: thesisData.metadata.authorName,
              spacing: { before: 200, after: 400 },
              alignment: AlignmentType.CENTER,
            })
          );
        }
        if (thesisData.metadata.thesisDate) {
          children.push(
            new Paragraph({
              text: thesisData.metadata.thesisDate,
              spacing: { before: 200, after: 400 },
              alignment: AlignmentType.CENTER,
            })
          );
        }

        // Add committee members if available
        if (thesisData.metadata.committeeMembers && thesisData.metadata.committeeMembers.length > 0) {
          children.push(
            new Paragraph({
              text: "Thesis Committee:",
              spacing: { before: 400, after: 200 },
              alignment: AlignmentType.CENTER,
            })
          );

          thesisData.metadata.committeeMembers.forEach((member: string) => {
            children.push(
              new Paragraph({
                text: member,
                spacing: { before: 100, after: 100 },
                alignment: AlignmentType.CENTER,
              })
            );
          });
        }
      }
    }

    // Add page break after title page
    children.push(
      new Paragraph({
        text: "",
        pageBreakBefore: true,
      })
    );

    // Add abstract
    const abstractSection = thesisData.frontMatter.find((section: any) => section.type === 'abstract');
    if (abstractSection) {
      children.push(
        new Paragraph({
          text: "Abstract",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          children: [new TextRun(abstractSection.content)],
          spacing: { before: 200, after: 400 },
        })
      );
    }

    // Add chapters
    thesisData.chapters.forEach((chapter: any) => {
      children.push(
        new Paragraph({
          text: chapter.title,
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
          pageBreakBefore: true,
        })
      );

      chapter.sections.forEach((section: any) => {
        children.push(
          new Paragraph({
            text: section.title,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            children: [new TextRun(section.content)],
            spacing: { before: 100, after: 200 },
          })
        );
      });
    });

    // Create document with proper sections and formatting
    const doc = new Document({
      sections: [
        {
          properties: {
            type: SectionType.CONTINUOUS,
          },
          headers: {
            default: new Header({
              children: [new Paragraph("Thesis Document")],
            }),
          },
          footers: {
            default: new Footer({
              children: [new Paragraph("Page ")],
            }),
          },
          children: children,
        },
      ],
    });

    console.log('Document generated, packing...');
    const buffer = await Packer.toBuffer(doc);
    console.log('Document packed successfully');

    return new Response(buffer, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${titleSection?.title || 'thesis'}.docx"`,
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