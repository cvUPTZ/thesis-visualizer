// supabase/functions/generate-docx/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Document, Paragraph, TextRun, HeadingLevel, TableOfContents, Packer } from 'https://deno.land/x/docx/mod.ts';

serve(async (req) => {
  try {
    const thesisData = await req.json();

    const doc = generateThesisDocx(thesisData);

    // Generate the blob
    const blob = await new Promise<ArrayBuffer>((resolve, reject) => {
      const packer = new Packer();
      packer.toBuffer(doc).then((buffer: ArrayBuffer) => {
        resolve(buffer);
      }).catch(reject);
    });

    return new Response(blob, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        'Content-Disposition': `attachment; filename=thesis.docx`,
      },
    });
  } catch (error) {
    console.error('Error generating docx:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});

const generateThesisDocx = (thesis: {
  frontMatter: any[];
  chapters: any[];
  backMatter: any[];
}) => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new TableOfContents("Table of Contents"),
          ...generateSectionContent(thesis.frontMatter),
          ...generateChapterContent(thesis.chapters),
          ...generateSectionContent(thesis.backMatter),
        ],
      },
    ],
  });

  return doc;
};

const generateSectionContent = (sections: any[]) => {
  return sections.flatMap((section: any) => [
    new Paragraph({
      text: section.title,
      heading: HeadingLevel.HEADING_1,
    }),
    new Paragraph({
      children: [new TextRun(section.content)],
    }),
  ]);
};

const generateChapterContent = (chapters: any[]) => {
  return chapters.flatMap((chapter: any) => [
    new Paragraph({
      text: chapter.title,
      heading: HeadingLevel.HEADING_1,
    }),
    ...chapter.sections.flatMap((section: any) => [
      new Paragraph({
        text: section.title,
        heading: HeadingLevel.HEADING_2,
      }),
      new Paragraph({
        children: [new TextRun(section.content)],
      }),
    ]),
  ]);
};