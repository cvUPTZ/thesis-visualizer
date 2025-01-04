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
    { type: 'theoretical-framework', title: 'Cadre théorique', required: true },
    { type: 'empirical-study', title: 'Partie empirique', required: true },
    { type: 'results', title: 'Résultats de recherche', required: true },
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

export type ThesisSectionType = 
  | 'title'
  | 'preface'
  | 'acknowledgments'
  | 'abstract'
  | 'table-of-contents'
  | 'list-of-figures'
  | 'abbreviations'
  | 'glossary'
  | 'introduction'
  | 'theoretical-framework'
  | 'empirical-study'
  | 'results'
  | 'conclusion'
  | 'recommendations'
  | 'postface'
  | 'references'
  | 'appendix'
  | 'advice'
  | 'custom';