import React from 'react';
import { GraduationCap, BookOpen, Award } from 'lucide-react';
import { Section, Thesis } from '@/types/thesis';

interface FrenchTitlePageProps {
  thesis: Thesis;
  titleSection?: Section;
}

export const FrenchTitlePage = ({ thesis, titleSection }: FrenchTitlePageProps) => {
  return (
    <div className="thesis-page title-page">
      <div className="thesis-title-content">
        <div className="university-decoration">
          <GraduationCap className="title-icon text-primary" size={48} />
        </div>
        <div className="university-name">
          {thesis.metadata?.universityName || "Nom de l'Université"}
        </div>
        <div className="department-name">
          {thesis.metadata?.departmentName || "Département"}
        </div>
        
        <div className="thesis-decoration">
          <BookOpen className="title-icon text-primary-light" size={36} />
        </div>
        <div className="thesis-main-title">
          {titleSection?.content || "Titre de la thèse"}
        </div>
        
        <div className="thesis-subtitle">
          Thèse présentée en vue de l'obtention<br />
          du grade de Docteur en<br />
          {thesis.metadata?.departmentName || "[Discipline]"}
        </div>
        
        <div className="author-decoration">
          <Award className="title-icon text-primary" size={32} />
        </div>
        <div className="thesis-author">
          par<br />
          {thesis.metadata?.authorName || "Nom de l'auteur"}
        </div>
        
        <div className="thesis-date">
          {thesis.metadata?.thesisDate || "Mois Année"}
        </div>
        
        <div className="thesis-committee">
          Membres du jury :<br />
          {thesis.metadata?.committeeMembers?.map((member, index) => (
            <React.Fragment key={index}>
              {member}<br />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};