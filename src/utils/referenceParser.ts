interface ParsedReference {
  title?: string;
  authors?: string[];
  year?: string;
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  publisher?: string;
  doi?: string;
  url?: string;
}

export const parseReference = (text: string, style: string): ParsedReference => {
  // Remove extra whitespace and normalize punctuation
  const normalizedText = text.trim().replace(/\s+/g, ' ');
  
  switch (style) {
    case 'APA': {
      // Example: Author, A. A., & Author, B. B. (Year). Title. Journal, Volume(Issue), pages.
      const match = normalizedText.match(
        /^(.*?)\s*\((\d{4})\)\.\s*(.*?)\.\s*(.*?),\s*(\d+)\((\d+)\),\s*(\d+[-–]\d+)/
      );
      
      if (match) {
        const [, authors, year, title, journal, volume, issue, pages] = match;
        return {
          authors: authors.split(',').map(a => a.trim()),
          year,
          title,
          journal,
          volume,
          issue,
          pages
        };
      }
      break;
    }
    
    case 'MLA': {
      // Example: Author. "Title." Journal, vol. Volume, no. Issue, Year, pp. Pages.
      const match = normalizedText.match(
        /^(.*?)\.\s*"(.*?)\."\s*(.*?),\s*vol\.\s*(\d+),\s*no\.\s*(\d+),\s*(\d{4}),\s*pp\.\s*(\d+[-–]\d+)/
      );
      
      if (match) {
        const [, author, title, journal, volume, issue, year, pages] = match;
        return {
          authors: [author.trim()],
          title,
          journal,
          volume,
          issue,
          year,
          pages
        };
      }
      break;
    }
    
    case 'Chicago': {
      // Example: Author. Year. "Title." Journal Volume, no. Issue: Pages.
      const match = normalizedText.match(
        /^(.*?)\.\s*(\d{4})\.\s*"(.*?)\."\s*(.*?)\s*(\d+),\s*no\.\s*(\d+):\s*(\d+[-–]\d+)/
      );
      
      if (match) {
        const [, author, year, title, journal, volume, issue, pages] = match;
        return {
          authors: [author.trim()],
          year,
          title,
          journal,
          volume,
          issue,
          pages
        };
      }
      break;
    }
    
    case 'Vancouver': {
      // Example: Author AA, Author BB. Title. Journal. Year;Volume(Issue):Pages.
      const match = normalizedText.match(
        /^(.*?)\.\s*(.*?)\.\s*(.*?)\.\s*(\d{4});(\d+)\((\d+)\):(\d+[-–]\d+)/
      );
      
      if (match) {
        const [, authors, title, journal, year, volume, issue, pages] = match;
        return {
          authors: authors.split(',').map(a => a.trim()),
          title,
          journal,
          year,
          volume,
          issue,
          pages
        };
      }
      break;
    }
    
    case 'Harvard': {
      // Example: Author, A. and Author, B. (Year) Title. Journal, Volume(Issue), pp. Pages.
      const match = normalizedText.match(
        /^(.*?)\s*\((\d{4})\)\s*(.*?)\.\s*(.*?),\s*(\d+)\((\d+)\),\s*pp\.\s*(\d+[-–]\d+)/
      );
      
      if (match) {
        const [, authors, year, title, journal, volume, issue, pages] = match;
        return {
          authors: authors.split('and').map(a => a.trim()),
          year,
          title,
          journal,
          volume,
          issue,
          pages
        };
      }
      break;
    }
  }
  
  // If no pattern matches, return the text as title
  return {
    title: text
  };
};