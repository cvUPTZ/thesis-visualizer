import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Document, Paragraph, TextRun, HeadingLevel, Packer } from "npm:docx";

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

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: thesisData.frontMatter[0]?.title || 'Untitled Thesis',
            heading: HeadingLevel.TITLE,
            spacing: { before: 3000, after: 400 },
          }),
          // Add abstract if available
          ...(thesisData.frontMatter[1]?.content ? [
            new Paragraph({
              text: "Abstract",
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 },
            }),
            new Paragraph({
              children: [new TextRun(thesisData.frontMatter[1].content)],
              spacing: { before: 200, after: 400 },
            })
          ] : []),
          // Add chapters
          ...(thesisData.chapters?.flatMap(chapter => [
            new Paragraph({
              text: chapter.title,
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 },
            }),
            ...(chapter.sections?.map(section => [
              new Paragraph({
                text: section.title,
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 100 },
              }),
              new Paragraph({
                children: [new TextRun(section.content)],
                spacing: { before: 100, after: 200 },
              })
            ]).flat() || [])
          ]).flat() || [])
        ],
      }],
    });

    console.log('Document generated, packing...');
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