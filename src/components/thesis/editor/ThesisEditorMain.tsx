import React, { useState, useRef } from 'react';
import { ThesisEditorContent } from './ThesisEditorContent';
import { ThesisEditorPreview } from './ThesisEditorPreview';
import { Chapter, Thesis } from '@/types/thesis';
import { useThesisRealtime } from '@/hooks/useThesisRealtime';
import { useToast } from '@/hooks/use-toast';

interface ThesisEditorMainProps {
  thesis: Thesis | null;
  activeSection: string;
  showPreview: boolean;
  previewRef: React.RefObject<HTMLDivElement>;
  onContentChange: (id: string, content: string) => void;
  onTitleChange: (id: string, title: string) => void;
  onUpdateChapter: (chapter: Chapter) => void;
  onAddChapter: (chapter: Chapter) => void;
}

export const ThesisEditorMain: React.FC<ThesisEditorMainProps> = ({
  thesis,
  activeSection,
  showPreview,
  previewRef,
  onContentChange,
  onTitleChange,
  onUpdateChapter,
  onAddChapter
}) => {
     const { toast } = useToast();
      const [localThesis, setLocalThesis] = useState(thesis);

    useThesisRealtime(thesis?.id, localThesis, setLocalThesis);


    const handleUpdateSectionData = (updatedSection: any) => {
        if (!localThesis) return;
      const updateThesis = () => {
             setLocalThesis((prev) => {
             if(!prev) return null;

             const frontMatter = prev.frontMatter.map((s) => (s.id === updatedSection.id ? updatedSection : s));
             const chapters = prev.chapters.map((chapter) => {
                 return {
                     ...chapter,
                    sections: chapter.sections.map(s => s.id === updatedSection.id ? updatedSection : s)
                 }
             });
               const backMatter = prev.backMatter.map((s) => (s.id === updatedSection.id ? updatedSection : s));

            return {
                ...prev,
                frontMatter,
                chapters,
                backMatter,
             };
         });
        }

      updateThesis()
  };


   const handleContentChange = (id: string, content: string) => {
       if (!localThesis) return;
        setLocalThesis((prev) => {
             if(!prev) return null;
        
            const frontMatter = prev.frontMatter.map(section =>
             section.id === id ? { ...section, content } : section
           );
           const chapters = prev.chapters.map(chapter => ({
                ...chapter,
                 sections: chapter.sections.map(section =>
              section.id === id ? { ...section, content } : section
                )
            }));
           const backMatter = prev.backMatter.map(section =>
              section.id === id ? { ...section, content } : section
            );
            
            return {
                ...prev,
                frontMatter,
                chapters,
                backMatter
            };
           
      });
      onContentChange(id, content);
    };

     const handleTitleChange = (id: string, title: string) => {
         if (!localThesis) return;
        setLocalThesis((prev) => {
             if(!prev) return null;
        
           const frontMatter = prev.frontMatter.map(section =>
                section.id === id ? { ...section, title } : section
              );
          const chapters = prev.chapters.map(chapter => ({
            ...chapter,
            sections: chapter.sections.map(section =>
                section.id === id ? { ...section, title } : section
             )
           }));
            const backMatter = prev.backMatter.map(section =>
            section.id === id ? { ...section, title } : section
              );
            
                return {
                ...prev,
                frontMatter,
                chapters,
                backMatter
               };
             
        });
      onTitleChange(id, title);
    };

    const handleAddSectionTask = (sectionId: string) => {
       if (!localThesis) return;
        setLocalThesis((prev) => {
           if(!prev) return null;
           const frontMatter = prev.frontMatter.map((s) => {
               if(s.id === sectionId){
                    return {
                      ...s,
                         tasks: [...(s.tasks || []),{ id: Date.now().toString(), description: 'New Task', status: 'pending' }]
                    }
               }
              return s;
           })
            const chapters = prev.chapters.map(chapter => ({
                ...chapter,
               sections: chapter.sections.map(s => {
                   if (s.id === sectionId) {
                        return {
                         ...s,
                       tasks: [...(s.tasks || []),{ id: Date.now().toString(), description: 'New Task', status: 'pending' }]
                        }
                    }
                   return s;
                })
           }))

            const backMatter = prev.backMatter.map(s => {
               if(s.id === sectionId){
                     return {
                         ...s,
                       tasks: [...(s.tasks || []),{ id: Date.now().toString(), description: 'New Task', status: 'pending' }]
                   }
               }
                return s;
           })
            
             return {
              ...prev,
              frontMatter,
              chapters,
              backMatter
            };

           });
    }

    const handleUpdateSectionTask = (sectionId: string, taskId: string, status: 'pending' | 'in progress' | 'completed' | 'on hold') => {
        if(!localThesis) return
       setLocalThesis((prev) => {
           if(!prev) return null;

            const frontMatter = prev.frontMatter.map((s) => {
              if(s.id === sectionId){
                 const updatedTasks = s.tasks.map((task) =>
                    task.id === taskId ? { ...task, status: status } : task
                   )
                    return { ...s, tasks: updatedTasks};
               }
               return s
            });
            const chapters = prev.chapters.map(chapter => ({
                 ...chapter,
                 sections: chapter.sections.map(s => {
                      if(s.id === sectionId){
                            const updatedTasks = s.tasks.map((task) =>
                                task.id === taskId ? { ...task, status } : task
                              )
                            return { ...s, tasks: updatedTasks}
                       }
                        return s
                  })
             }))
               const backMatter = prev.backMatter.map((s) => {
                 if(s.id === sectionId){
                     const updatedTasks = s.tasks.map((task) =>
                       task.id === taskId ? { ...task, status } : task
                     )
                      return { ...s, tasks: updatedTasks};
                 }
                 return s
             });

               return {
                ...prev,
                frontMatter,
                 chapters,
                backMatter
             };
       })
  };

      const handleSectionTaskDescriptionChange = (sectionId: string, taskId: string, newDescription: string) => {
         if(!localThesis) return;

       setLocalThesis((prev) => {
              if(!prev) return null;

            const frontMatter = prev.frontMatter.map((s) => {
              if(s.id === sectionId){
                     const updatedTasks = s.tasks.map((task) =>
                     task.id === taskId ? { ...task, description: newDescription } : task
                     )
                     return { ...s, tasks: updatedTasks };
                }
               return s;
           })
            const chapters = prev.chapters.map(chapter => ({
                 ...chapter,
                 sections: chapter.sections.map(s => {
                        if(s.id === sectionId){
                            const updatedTasks = s.tasks.map((task) =>
                                task.id === taskId ? { ...task, description: newDescription } : task
                            )
                           return { ...s, tasks: updatedTasks}
                        }
                       return s;
                   })
               }))
            const backMatter = prev.backMatter.map(s => {
               if(s.id === sectionId){
                     const updatedTasks = s.tasks.map((task) =>
                         task.id === taskId ? { ...task, description: newDescription } : task
                   )
                     return { ...s, tasks: updatedTasks };
                }
               return s;
            })
            
               return {
                ...prev,
                frontMatter,
                 chapters,
                backMatter
               };
       })
  };
  
  return (
    <main className="flex-1 p-8 flex">
      <div className={`transition-all duration-300 ${showPreview ? 'w-1/2' : 'w-full'}`}>
        <div className="max-w-4xl mx-auto space-y-6">
          <ThesisEditorContent
              frontMatter={localThesis?.frontMatter || []}
            chapters={localThesis?.chapters || []}
            backMatter={localThesis?.backMatter || []}
            activeSection={activeSection}
            onContentChange={handleContentChange}
            onTitleChange={handleTitleChange}
            onUpdateChapter={onUpdateChapter}
            onAddChapter={onAddChapter}
            onUpdateSectionData={handleUpdateSectionData}
            onAddSectionTask={handleAddSectionTask}
            onUpdateSectionTask={handleUpdateSectionTask}
            onChangeSectionTaskDescription={handleSectionTaskDescriptionChange}
          />
        </div>
      </div>
        {showPreview && localThesis && (
        <div className="w-1/2 pl-8 border-l">
          <ThesisEditorPreview thesis={localThesis} previewRef={previewRef} />
        </div>
      )}
    </main>
  );
};