import { IStylesOptions } from 'docx';

export interface DocxGenerationOptions {
  font: string;
  fontSize: number;
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
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
}

export interface TableOptions {
  headers: string[];
  rows: string[][];
  style?: string;
}

export interface StyleConfig {
  default: IStylesOptions;
}