import React from 'react';
import { Section, Thesis } from '@/types/thesis';
import { GraduationCap, BookOpen, Award } from 'lucide-react';

interface FrenchTitlePageProps {
  thesis: Thesis;
  titleSection?: Section;
}

export const FrenchTitlePage: React.FC<FrenchTitlePageProps> = ({ thesis, titleSection }) => {
  return (
    <div className="thesis-page title-page min-h-[297mm] flex flex-col items-center justify-between py-16 px-8">
      <div className="thesis-title-content w-full max-w-3xl mx-auto space-y-12 text-center">
        <div className="university-section space-y-4">
          <div className="university-decoration flex justify-center">
            <GraduationCap className="title-icon text-primary" size={48} />
          </div>
          <div className="university-name text-2xl font-semibold">
            {thesis.metadata?.universityName || "Nom de l'Université"}
          </div>
          <div className="department-name text-xl">
            {thesis.metadata?.departmentName || "Département"}
          </div>
        </div>
        
        <div className="thesis-section space-y-6 mt-16">
          <div className="thesis-decoration flex justify-center">
            <BookOpen className="title-icon text-primary-light" size={36} />
          </div>
          <div className="thesis-main-title text-3xl font-bold leading-relaxed">
            {titleSection?.content || "Titre de la thèse"}
          </div>
        </div>
        
        <div className="thesis-subtitle text-lg leading-relaxed mt-8">
          Thèse présentée en vue de l'obtention<br />
          du grade de Docteur en<br />
          {thesis.metadata?.departmentName || "[Discipline]"}
        </div>
        
        <div className="author-section space-y-4 mt-16">
          <div className="author-decoration flex justify-center">
            <Award className="title-icon text-primary" size={32} />
          </div>
          <div className="thesis-author text-xl">
            par<br />
            <span className="font-semibold">{thesis.metadata?.authorName || "Nom de l'auteur"}</span>
          </div>
        </div>
        
        <div className="thesis-date text-lg mt-8">
          {thesis.metadata?.thesisDate || "Mois Année"}
        </div>
      </div>
    </div>
  );
};