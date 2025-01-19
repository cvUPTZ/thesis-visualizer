/**
 * Extracts initials from a string (usually a name or email)
 * For emails, it uses the part before the @ symbol
 * @param text - The input string to extract initials from
 * @returns The first letter of each word, uppercase
 */
export const getInitials = (text: string): string => {
  // For email addresses, only use the part before @
  const cleanText = text.split('@')[0];
  
  // Split by common separators and filter out empty strings
  const words = cleanText
    .split(/[\s._-]+/)
    .filter(word => word.length > 0);

  // Take first letter of each word, max 2 letters
  const initials = words
    .map(word => word[0].toUpperCase())
    .slice(0, 2)
    .join('');

  return initials || '?';
};