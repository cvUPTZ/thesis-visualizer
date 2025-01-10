import { IStylesOptions, PageNumberFormat } from 'docx';

export interface DocxGenerationOptions {
  font: string;
  fontSize: number;
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  pageNumberFormat?: PageNumberFormat;
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

export interface StyleConfig {
  default: IStylesOptions;
  preliminary?: IStylesOptions;
}

export interface SectionNumbering {
  format: 'decimal' | 'lowerRoman';
  start: number;
}