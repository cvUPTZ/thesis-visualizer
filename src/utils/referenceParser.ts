interface ParsedReference {
  title: string;
  authors: string[];
  year: string;
  publisher?: string;
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  url?: string;
}

export const parseReference = (text: string): ParsedReference => {
  console.log('Starting reference parsing for:', text);
  
  // Clean up the text
  const cleanText = text.trim().replace(/\s+/g, ' ');
  
  // Extract author information
  const authorPattern = /^((?:[A-Z][a-zA-Z'`-]+,?\s*(?:[A-Z]\.|[A-Z][a-z]+\s)?(?:[A-Z]\.)?\s*(?:&|,|and)?\s*)+)/;
  const authorMatch = cleanText.match(authorPattern);
  const authors = authorMatch ? authorMatch[1]
    .split(/(?:,\s*(?:&|and)|\s*(?:&|and)|\s*,)\s*/)
    .filter(author => author.trim().length > 0)
    .map(author => author.trim()) : [];

  // Extract year
  const yearPattern = /\((\d{4})\)|(\d{4})/;
  const yearMatch = cleanText.match(yearPattern);
  const year = yearMatch ? yearMatch[1] || yearMatch[2] : 'n.d.';

  // Extract title
  let title = '';
  const titlePattern = /(?:\(\d{4}\)|,\s*\d{4})\.\s*([^\.]+)/;
  const titleMatch = cleanText.match(titlePattern);
  if (titleMatch) {
    title = titleMatch[1].trim().replace(/["']/g, '');
  } else {
    // Fallback: try to find text between author/year and the next period
    const afterAuthorYear = cleanText.replace(authorPattern, '').replace(yearPattern, '');
    const fallbackTitleMatch = afterAuthorYear.match(/^\s*[.,]?\s*([^.]+)/);
    title = fallbackTitleMatch ? fallbackTitleMatch[1].trim() : '';
  }

  // Extract DOI
  const doiPattern = /doi:\s*(10\.\d{4,}\/[-._;()\/:A-Z0-9]+)/i;
  const doiMatch = cleanText.match(doiPattern);
  const doi = doiMatch ? doiMatch[1] : undefined;

  // Extract URL
  const urlPattern = /(?:Retrieved from |Available at |URL: )(https?:\/\/[^\s]+)/i;
  const urlMatch = cleanText.match(urlPattern);
  const url = urlMatch ? urlMatch[1] : undefined;

  // Extract journal information
  const journalPattern = /(?:In |"|")\s*([^"]+)"?,?\s*(?:Vol\.|Volume)?\s*(\d+)?(?:\s*\((\d+)\))?,?\s*(?:pp\.|pages)?\s*(\d+(?:-\d+)?)?/i;
  const journalMatch = cleanText.match(journalPattern);
  
  const journal = journalMatch ? journalMatch[1]?.trim() : undefined;
  const volume = journalMatch ? journalMatch[2] : undefined;
  const issue = journalMatch ? journalMatch[3] : undefined;
  const pages = journalMatch ? journalMatch[4] : undefined;

  // Extract publisher (usually appears after title for books)
  const publisherPattern = /(?::\s*)([^\.]+)(?=\s*Publisher|Press|\.$)/i;
  const publisherMatch = cleanText.match(publisherPattern);
  const publisher = publisherMatch ? publisherMatch[1].trim() : undefined;

  console.log('Parsed reference result:', {
    authors,
    year,
    title,
    journal,
    volume,
    issue,
    pages,
    doi,
    url,
    publisher
  });

  return {
    authors,
    year,
    title,
    journal,
    volume,
    issue,
    pages,
    doi,
    url,
    publisher
  };
};