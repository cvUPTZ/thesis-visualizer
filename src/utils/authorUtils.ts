import { Author } from '@/types/thesis';

export const authorToString = (author: Author): string => {
  return `${author.lastName}, ${author.firstName}${author.affiliation ? ` (${author.affiliation})` : ''}`;
};

// Helper to create an Author object
export const createAuthor = (
  firstName: string,
  lastName: string,
  email?: string,
  affiliation?: string
): Author => ({
  firstName,
  lastName,
  email,
  affiliation,
  toString: function() {
    return authorToString(this);
  }
});