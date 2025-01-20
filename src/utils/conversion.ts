import { convertInchesToTwip as docxConvertInchesToTwip } from 'docx';

export const convertInchesToTwip = (inches: number): number => {
  return docxConvertInchesToTwip(inches);
};