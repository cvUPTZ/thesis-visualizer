import { IStylesOptions, BorderStyle, INumberingOptions, convertInchesToTwip } from 'docx';

export interface DocxGenerationOptions {
  font: string;
  fontSize: number;
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  pageNumberFormat?: 'decimal' | 'lowerRoman' | 'upperRoman';
}

export interface ImageOptions {
  data: Buffer | Uint8Array;
  width: number;
  height: number;
  type?: string;
  fallback?: string;
}

export interface TitlePageOptions {
  title: string;
  author: string;
  date: string;
  university?: string;
  department?: string;
  degree?: string;
}

export interface TableOptions {
  headers: string[];
  rows: string[][];
  style?: string;
  caption?: string;
  label?: string;
}

export interface SectionNumbering {
  format: 'decimal' | 'lowerRoman' | 'upperRoman';
  start: number;
}

export interface ThesisMetadata {
  title: string;
  author: string;
  date: string;
  university: string;
  department: string;
  degree: string;
}