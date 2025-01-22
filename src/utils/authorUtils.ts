import { Author } from '@/types/thesis';

export class AuthorImpl implements Author {
  constructor(
    public firstName: string,
    public lastName: string,
    public email?: string,
    public affiliation?: string
  ) {}

  toString(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

export const createAuthor = (
  firstName: string,
  lastName: string,
  email?: string,
  affiliation?: string
): Author => {
  return new AuthorImpl(firstName, lastName, email, affiliation);
};

export const authorToString = (author: Author): string => {
  if (typeof author === 'string') return author;
  return `${author.firstName} ${author.lastName}`;
};

export const parseAuthorString = (authorString: string): Author => {
  const [firstName, ...lastNameParts] = authorString.split(' ');
  const lastName = lastNameParts.join(' ');
  return createAuthor(firstName, lastName);
};