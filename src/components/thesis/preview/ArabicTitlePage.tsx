import React from 'react';
import { Thesis } from '@/types/thesis';
import { GraduationCap, BookOpen, Award } from 'lucide-react';

interface ArabicTitlePageProps {
  thesis: Thesis;
  titleSection?: { content: string };
}

export const ArabicTitlePage = ({ thesis, titleSection }: ArabicTitlePageProps) => {
  return (
    <div className="thesis-page title-page" dir="rtl">
      <div className="thesis-title-content text-right">
        <div className="university-decoration">
          <GraduationCap className="title-icon text-primary mx-auto" size={48} />
        </div>
        <div className="university-name text-2xl font-bold mb-4">
          {thesis.metadata?.universityName || "اسم الجامعة"}
        </div>
        <div className="department-name text-xl mb-8">
          {thesis.metadata?.departmentName || "اسم القسم"}
        </div>
        
        <div className="thesis-decoration">
          <BookOpen className="title-icon text-primary-light mx-auto" size={36} />
        </div>
        <div className="thesis-main-title text-3xl font-bold mb-8">
          {titleSection?.content || "عنوان الأطروحة"}
        </div>
        
        <div className="thesis-subtitle text-lg mb-8">
          رسالة مقدمة للحصول على درجة<br />
          الدكتوراه في الفلسفة
        </div>
        
        <div className="author-decoration">
          <Award className="title-icon text-primary mx-auto" size={32} />
        </div>
        <div className="thesis-author mb-8">
          إعداد الطالب/ة<br />
          {thesis.metadata?.authorName || "اسم الباحث/ة"}
        </div>
        
        <div className="thesis-date mb-8">
          {thesis.metadata?.thesisDate || "التاريخ الهجري / الميلادي"}
        </div>
        
        <div className="thesis-committee">
          لجنة الإشراف:<br />
          {thesis.metadata?.committeeMembers?.map((member, index) => (
            <React.Fragment key={index}>
              {member}
              <br />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};