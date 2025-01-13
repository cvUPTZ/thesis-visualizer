import React from 'react';
import { Section, ThesisMetadata } from '@/types/thesis';
import { GraduationCap, BookOpen, Award } from 'lucide-react';

interface TitlePageProps {
  metadata: ThesisMetadata;
  titleSection?: Section;
}

export const TitlePage: React.FC<TitlePageProps> = ({ metadata, titleSection }) => {
  return (
    <div className="thesis-page title-page min-h-[297mm] flex flex-col items-center justify-between py-16 px-8">
      <div className="thesis-title-content w-full max-w-3xl mx-auto space-y-12 text-center">
        <div className="university-section space-y-4">
          <div className="university-decoration flex justify-center">
            <GraduationCap className="title-icon text-primary" size={48} />
          </div>
          <div className="university-name text-2xl font-semibold">
            {metadata?.universityName || "University Name"}
          </div>
          <div className="department-name text-xl">
            {metadata?.departmentName || "Department Name"}
          </div>
        </div>
        
        <div className="thesis-section space-y-6 mt-16">
          <div className="thesis-decoration flex justify-center">
            <BookOpen className="title-icon text-primary-light" size={36} />
          </div>
          <div className="thesis-main-title text-3xl font-bold leading-relaxed">
            {titleSection?.content || "Thesis Title"}
          </div>
        </div>
        
        <div className="thesis-subtitle text-lg leading-relaxed mt-8">
          A thesis submitted in partial fulfillment<br />
          of the requirements for the degree of<br />
          {metadata?.degree || "Doctor of Philosophy"}
        </div>
        
        <div className="author-section space-y-4 mt-16">
          <div className="author-decoration flex justify-center">
            <Award className="title-icon text-primary" size={32} />
          </div>
          <div className="thesis-author text-xl">
            by<br />
            <span className="font-semibold">{metadata?.authorName || "Author Name"}</span>
          </div>
        </div>
        
        <div className="thesis-date text-lg mt-8">
          {metadata?.thesisDate || "Month Year"}
        </div>
      </div>
    </div>
  );
};