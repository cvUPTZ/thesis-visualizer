import React, { useState } from 'react';
import { CentralProgress } from './thesis-map/CentralProgress';
import { SectionNode } from './thesis-map/SectionNode';
import { StatsDisplay } from './thesis-map/StatsDisplay';
import { BackgroundEffects } from './thesis-map/BackgroundEffects';

interface ThesisProgressMapProps {
  stats: {
    total: number;
    inProgress: number;
    completed: number;
  };
}

export const ThesisProgressMap = ({ stats }: ThesisProgressMapProps) => {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const totalProgress = Math.round((stats.completed / stats.total) * 100);

  const sections = [
    { id: 'introduction', title: 'Introduction', progress: 100, complete: true },
    { id: 'literature', title: 'Literature Review', progress: 85, complete: false },
    { id: 'methodology', title: 'Methodology', progress: 60, complete: false },
    { id: 'results', title: 'Results', progress: 40, complete: false },
    { id: 'discussion', title: 'Discussion', progress: 20, complete: false },
    { id: 'conclusion', title: 'Conclusion', progress: 10, complete: false },
  ];

  const getPositionOnCircle = (index: number, total: number, radius: number) => {
    const angle = (index * 360) / total + 90;
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;
    return { x, y };
  };

  return (
    <div className="relative w-full h-[600px] bg-white rounded-3xl overflow-hidden shadow-lg">
      <BackgroundEffects />
      <CentralProgress totalProgress={totalProgress} />

      {sections.map((section, index) => {
        const position = getPositionOnCircle(index, sections.length, 200);
        return (
          <SectionNode
            key={section.id}
            id={section.id}
            title={section.title}
            progress={section.progress}
            complete={section.complete}
            position={position}
            hoveredSection={hoveredSection}
            onHover={setHoveredSection}
          />
        );
      })}

      <StatsDisplay stats={stats} />
    </div>
  );
};