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
  author_last_names: string[];
  author_first_initials: string[];
  author_middle_initials: string[];
  specific_date?: string;
  container_title?: string;
  edition?: string;
}

export const parseReference = (text: string): ParsedReference => {
  console.log('Starting reference parsing for:', text);
  
  // Remove any special characters at the start (like %%)
  const cleanText = text.trim().replace(/^[%\s]+/, '');
  
  // Extract authors and split into components
  const authorPattern = /^(.*?)\s*\(/;
  const authorMatch = cleanText.match(authorPattern);
  const authorString = authorMatch ? authorMatch[1] : '';
  
  // Split authors by comma and '&'
  const authorNames = authorString
    .split(/,\s*(?:&|\band\b)?\s*/)
    .filter(name => name.trim().length > 0)
    .map(name => name.trim());

  // Process each author name
  const author_last_names: string[] = [];
  const author_first_initials: string[] = [];
  const author_middle_initials: string[] = [];
  
  authorNames.forEach(name => {
    const nameParts = name.split(',')[0].trim().split(' ');
    if (nameParts.length > 0) {
      author_last_names.push(nameParts[nameParts.length - 1]);
      if (nameParts.length > 1) {
        author_first_initials.push(nameParts[0][0] || '');
        if (nameParts.length > 2) {
          author_middle_initials.push(nameParts[1][0] || '');
        } else {
          author_middle_initials.push('');
        }
      }
    }
  });

  // Extract year
  const yearPattern = /\((\d{4})\)/;
  const yearMatch = cleanText.match(yearPattern);
  const year = yearMatch ? yearMatch[1] : 'n.d.';

  // Extract title
  const titlePattern = /\)\.\s*(.*?)\./;
  const titleMatch = cleanText.match(titlePattern);
  const title = titleMatch ? titleMatch[1].trim() : '';

  // Extract journal/container title
  const journalPattern = /\.\s*(.*?),\s*\d/;
  const journalMatch = cleanText.match(journalPattern);
  const journal = journalMatch ? journalMatch[1].trim() : '';

  // Extract volume and issue
  const volumeIssuePattern = /,\s*(\d+)\((\d+)\)/;
  const volumeIssueMatch = cleanText.match(volumeIssuePattern);
  const volume = volumeIssueMatch ? volumeIssueMatch[1] : '';
  const issue = volumeIssueMatch ? volumeIssueMatch[2] : '';

  // Extract pages
  const pagesPattern = /,\s*(\d+(?:-\d+)?)\./;
  const pagesMatch = cleanText.match(pagesPattern);
  const pages = pagesMatch ? pagesMatch[1] : '';

  // Extract DOI or URL
  const doiPattern = /https:\/\/doi\.org\/(.*?)(?:\s|$)/;
  const doiMatch = cleanText.match(doiPattern);
  const doi = doiMatch ? doiMatch[1] : '';
  
  const urlPattern = /(https?:\/\/[^\s]+)(?:\s|$)/;
  const urlMatch = cleanText.match(urlPattern);
  const url = urlMatch ? urlMatch[1] : '';

  console.log('Parsed reference result:', {
    authors: authorNames,
    author_last_names,
    author_first_initials,
    author_middle_initials,
    year,
    title,
    journal,
    volume,
    issue,
    pages,
    doi,
    url
  });

  return {
    authors: authorNames,
    author_last_names,
    author_first_initials,
    author_middle_initials,
    year,
    title,
    journal,
    volume,
    issue,
    pages,
    doi,
    url,
    specific_date: undefined,
    container_title: journal,
    edition: undefined
  };
};