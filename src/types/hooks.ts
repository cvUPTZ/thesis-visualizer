import { UseQueryResult } from '@tanstack/react-query';
import { Thesis, Chapter, Section } from './thesis';

export interface UseThesisResult {
  thesis: Thesis | null;
  isLoading: boolean;
  error: Error | null;
  setThesis: (thesis: Thesis | ((prev: Thesis | null) => Thesis | null)) => void;
}

export interface UseChapterResult {
  chapter: Chapter | null;
  isLoading: boolean;
  error: Error | null;
  updateChapter: (chapter: Chapter) => Promise<void>;
}

export interface UseSectionResult {
  section: Section | null;
  isLoading: boolean;
  error: Error | null;
  updateSection: (section: Section) => Promise<void>;
}

export type QueryResult<T> = UseQueryResult<T, Error>;