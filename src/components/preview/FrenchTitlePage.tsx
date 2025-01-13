import React from 'react';
import { Section, Thesis } from '@/types/thesis';
import { GraduationCap, BookOpen, Award } from 'lucide-react';

interface FrenchTitlePageProps {
  thesis: Thesis;
  titleSection?: Section;
}

export const FrenchTitlePage: React.FC<FrenchTitlePageProps> = ({ thesis, titleSection }) => {
  return (
    <div className="thesis-page title-page">
      <div className="thesis-title-content">
        <div className="university-decoration">
          <GraduationCap className="title-icon text-primary mx-auto" size={48} />
        </div>
        <div className="university-name text-2xl font-bold mb-4">
          {thesis.metadata?.universityName || "Nom de l'Université"}
        </div>
        <div className="department-name text-xl mb-8">
          {thesis.metadata?.departmentName || "Département"}
        </div>
        
        <div className="thesis-decoration">
          <BookOpen className="title-icon text-primary-light mx-auto" size={36} />
        </div>
        <div className="thesis-main-title text-3xl font-bold mb-8">
          {titleSection?.content || "Titre de la thèse"}
        </div>
        
        <div className="thesis-subtitle text-lg mb-8">
          Thèse présentée en vue de l'obtention<br />
          du grade de Docteur en<br />
          {thesis.metadata?.departmentName || "[Discipline]"}
        </div>
        
        <div className="author-decoration">
          <Award className="title-icon text-primary mx-auto" size={32} />
        </div>
        <div className="thesis-author mb-8">
          par<br />
          {thesis.metadata?.authorName || "Nom de l'auteur"}
        </div>
        
        <div className="thesis-date mb-8">
          {thesis.metadata?.thesisDate || "Mois Année"}
        </div>
      </div>
    </div>
  );
};