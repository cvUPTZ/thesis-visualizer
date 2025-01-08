import { IStylesOptions, ITableOptions, TableProperties } from 'docx';

export interface DocxGenerationOptions {
  font: string;
  fontSize: number;
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface TitlePageOptions {
  title: string;
  author: string;
  date: string;
}

export interface ImageOptions {
  data: Buffer;
  width: number;
  height: number;
  caption?: string;
}

export interface DocPropertiesOptions {
  title?: string;
  subject?: string;
  creator?: string;
  keywords?: string[];
  description?: string;
}