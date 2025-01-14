// // // MarkdownEditor.tsx
// // import React, { useCallback, useMemo, useRef } from 'react';
// // import MDEditor, { commands } from '@uiw/react-md-editor';
// // import { EditorProps } from '@/types/components';
// // import { Card } from './ui/card';
// // import { motion } from 'framer-motion';

// // export const MarkdownEditor: React.FC<EditorProps> = React.memo(({ 
// //   value, 
// //   onChange, 
// //   placeholder 
// // }) => {
// //   // Use ref to track previous value
// //   const prevValueRef = useRef(value);

// //   // Optimize change handler
// //   const handleChange = useCallback((newValue: string | undefined) => {
// //     // Only trigger onChange if value actually changed
// //     if (newValue !== prevValueRef.current) {
// //       prevValueRef.current = newValue || '';
// //       onChange(newValue || '');
// //     }
// //   }, [onChange]);

// //   // Memoize commands
// //   const customCommands = useMemo(() => [
// //     commands.title1,
// //     commands.title2,
// //     commands.title3,
// //     commands.bold,
// //     commands.italic,
// //     commands.strikethrough,
// //     commands.hr,
// //     commands.link,
// //     commands.quote,
// //     commands.code,
// //     commands.unorderedListCommand,
// //     commands.orderedListCommand,
// //   ], []);

// //   return (
// //     <div className="w-full"> {/* Remove motion.div to reduce animation overhead */}
// //       <Card className="overflow-hidden bg-white/50 backdrop-blur-sm border-2 border-primary/10 shadow-xl rounded-xl">
// //         <MDEditor
// //           value={value}
// //           onChange={handleChange}
// //           preview="live"
// //           height={400}
// //           className="border-none bg-transparent"
// //           hideToolbar={false}
// //           commands={customCommands}
// //           textareaProps={{
// //             placeholder,
// //             className: "focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-md p-4 bg-editor-bg/50",
// //             "data-testid": "markdown-editor-textarea",
// //           }}
// //           previewOptions={{
// //             skipHtml: true,
// //             lazy: true
// //           }}
// //           // Add performance optimizations
// //           renderHTML={text => Promise.resolve(text)}
// //           visibleDragbar={false}
// //           enableScroll={true}
// //         />
// //       </Card>
// //     </div>
// //   );
// // });

// // // Usage in SectionContent
// // export const SectionContent: React.FC<SectionContentProps> = React.memo(({
// //   section,
// //   isActive,
// //   onContentChange,
// //   onUpdateSectionData
// // }) => {
// //   const handleEditorChange = useCallback((content: string) => {
// //     // Batch the updates
// //     requestAnimationFrame(() => {
// //       onContentChange(content);
// //       onUpdateSectionData({
// //         ...section,
// //         content
// //       });
// //     });
// //   }, [section, onContentChange, onUpdateSectionData]);

// //   if (!isActive) return null;

// //   return (
// //     <div className="w-full">
// //       <MarkdownEditor
// //         value={section.content}
// //         onChange={handleEditorChange}
// //         placeholder="Start writing your section content..."
// //       />
// //     </div>
// //   );
// // });


// // MarkdownEditor.tsx
// import React, { useCallback, useMemo, useRef, useEffect } from 'react';
// import MDEditor, { commands } from '@uiw/react-md-editor';
// import { EditorProps } from '@/types/components';
// import { Card } from './ui/card';

// export const MarkdownEditor: React.FC<EditorProps> = React.memo(({ 
//   value, 
//   onChange, 
//   placeholder 
// }) => {
//   const prevValueRef = useRef(value);
//   const textAreaRef = useRef<HTMLTextAreaElement>(null);
 

//   const handleChange = useCallback((newValue: string | undefined) => {
//     if (newValue !== prevValueRef.current) {
//       prevValueRef.current = newValue || '';
//       onChange(newValue || '');
//     }
//   }, [onChange]);

//   useEffect(() => {
//     textAreaRef.current?.focus();
//   }, []);

//   const customCommands = useMemo(() => [
//     commands.title1,
//     commands.title2,
//     commands.title3,
//     commands.bold,
//     commands.italic,
//     commands.strikethrough,
//     commands.hr,
//     commands.link,
//     commands.quote,
//     commands.code,
//     commands.unorderedListCommand,
//     commands.orderedListCommand,
//   ], []);

//   return (
//     <div className="w-full">
//       <Card className="overflow-hidden bg-white/50 backdrop-blur-sm border-2 border-primary/10 shadow-xl rounded-xl">
//         <MDEditor
//           value={value}
//           onChange={handleChange}
//           preview="live"
//           height={400}
//           className="border-none bg-transparent"
//           hideToolbar={false}
//           commands={customCommands}
//            textareaProps={{
//              ref: textAreaRef,
//             placeholder,
//             className: "focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-md p-4 bg-editor-bg/50",
//             "data-testid": "markdown-editor-textarea",
//           }}
//           previewOptions={{
//             skipHtml: true,
//             lazy: true
//           }}
//           renderHTML={text => Promise.resolve(text)}
//           visibleDragbar={false}
//           enableScroll={true}
//         />
//       </Card>
//     </div>
//   );
// });
import React, { useMemo } from 'react';
import MDEditor, { commands, type ICommand } from '@uiw/react-md-editor';
import { EditorProps } from '@/types/components';
import { Card } from './ui/card';
import { motion } from 'framer-motion';

const editorAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
};

export const MarkdownEditor = React.memo(({ 
  value, 
  onChange, 
  placeholder 
}: EditorProps) => {
  // Memoize commands array to prevent recreating on every render
  const customCommands = useMemo(() => {
    const headingCommands = [
      commands.title1,
      commands.title2,
      commands.title3,
      commands.title4,
      commands.title5,
      commands.title6,
    ];

    return [
      ...headingCommands,
      commands.divider,
      commands.bold,
      commands.italic,
      commands.strikethrough,
      commands.hr,
      commands.divider,
      commands.link,
      commands.quote,
      commands.code,
      commands.divider,
      commands.unorderedListCommand,
      commands.orderedListCommand,
      commands.checkedListCommand,
    ] as ICommand[];
  }, []);

  // Memoize textarea props
  const textareaProps = useMemo(() => ({
    placeholder,
    className: "focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-md p-4 bg-editor-bg/50",
  }), [placeholder]);

  // Memoize preview options
  const previewOptions = useMemo(() => ({
    className: "prose prose-sm max-w-none prose-headings:font-serif prose-headings:text-editor-text prose-p:text-editor-text p-4",
    skipHtml: false,
    rehypeRewrite: (node: any) => {
      if (node.type === 'element' && node.tagName === 'a') {
        node.properties = {
          ...node.properties,
          target: '_blank',
          rel: 'noopener noreferrer',
          className: 'text-primary hover:text-primary/80 transition-colors duration-200'
        };
      }
    }
  }), []);

  return (
    <motion.div
      {...editorAnimation}
      layout={false} // Prevent layout animations
    >
      <Card className="overflow-hidden bg-white/50 backdrop-blur-sm border-2 border-primary/10 shadow-xl rounded-xl" data-color-mode="light">
        <MDEditor
          value={value}
          onChange={(val) => onChange(val || '')}
          preview="edit"
          height={400}
          className="border-none bg-transparent"
          hideToolbar={false}
          commands={customCommands}
          textareaProps={textareaProps}
          previewOptions={previewOptions}
        />
      </Card>
    </motion.div>
  );
});

// Add display name for debugging
MarkdownEditor.displayName = 'MarkdownEditor';