export const frenchThesisSections = {
  frontMatter: [
    { type: 'title', title: 'Page de garde', required: true },
    { type: 'preface', title: 'Avant-propos', required: false },
    { type: 'preface', title: 'Préface', required: false },
    { type: 'acknowledgments', title: 'Remerciements', required: false },
    { type: 'abstract', title: 'Résumé', required: true },
    { type: 'table-of-contents', title: 'Sommaire', required: true },
    { type: 'list-of-figures', title: 'Liste des tableaux et figures', required: true },
    { type: 'abbreviations', title: 'Liste des abréviations', required: false },
    { type: 'glossary', title: 'Glossaire', required: false }
  ],
  mainMatter: [
    { type: 'introduction', title: 'Introduction', required: true },
    { type: 'literature-review', title: 'Revue de littérature', required: true },
    { type: 'methodology', title: 'Méthodologie', required: true },
    { type: 'results', title: 'Résultats', required: true },
    { type: 'discussion', title: 'Discussion', required: true },
    { type: 'conclusion', title: 'Conclusion', required: true },
    { type: 'recommendations', title: 'Recommandations', required: false }
  ],
  backMatter: [
    { type: 'postface', title: 'Postface', required: false },
    { type: 'references', title: 'Bibliographie', required: true },
    { type: 'appendix', title: 'Annexes', required: false },
    { type: 'advice', title: 'Conseils', required: false }
  ]
};

export const arabicThesisSections = {
  frontMatter: [
    { type: 'title', title: 'صفحة العنوان', required: true },
    { type: 'abstract', title: 'ملخص', required: true },
    { type: 'acknowledgments', title: 'شكر وتقدير', required: false },
    { type: 'table-of-contents', title: 'جدول المحتويات', required: true },
    { type: 'list-of-figures', title: 'قائمة الأشكال', required: true },
    { type: 'list-of-tables', title: 'قائمة الجداول', required: true },
    { type: 'abbreviations', title: 'قائمة الاختصارات', required: false }
  ],
  mainMatter: [
    { type: 'introduction', title: 'المقدمة', required: true },
    { type: 'theoretical-framework', title: 'الإطار النظري', required: true },
    { type: 'methodology', title: 'منهجية البحث', required: true },
    { type: 'results', title: 'النتائج', required: true },
    { type: 'discussion', title: 'المناقشة', required: true },
    { type: 'conclusion', title: 'الخاتمة', required: true },
    { type: 'recommendations', title: 'التوصيات', required: false }
  ],
  backMatter: [
    { type: 'references', title: 'المراجع', required: true },
    { type: 'appendix', title: 'الملاحق', required: false }
  ]
};

export type ThesisSectionType = 
  | 'title'
  | 'preface'
  | 'acknowledgments'
  | 'abstract'
  | 'table-of-contents'
  | 'list-of-figures'
  | 'list-of-tables'
  | 'abbreviations'
  | 'glossary'
  | 'introduction'
  | 'literature-review'
  | 'theoretical-framework'
  | 'methodology'
  | 'empirical-study'
  | 'results'
  | 'discussion'
  | 'conclusion'
  | 'recommendations'
  | 'postface'
  | 'references'
  | 'appendix'
  | 'advice'
  | 'custom';