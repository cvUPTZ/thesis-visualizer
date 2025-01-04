import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, GitBranch } from 'lucide-react';

const ThesisVisualization = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <style>
        {`
          /* Flex */
          .py-24 .flex .flex{
           position:relative;
           top:10px;
          }

          /* Flex */
          #root .flex:nth-child(9) .flex:nth-child(1){
           top:15px;
           transform:translatex(-15px) translatey(31px) !important;
          }

          /* Flex */
          #root .flex .flex:nth-child(2){
           transform:translatex(-3px) translatey(36px) !important;
          }

          /* Flex */
          #root .py-24 .flex:nth-child(3){
           transform:translatex(9px) translatey(37px) !important;
          }

          /* Primary/10 */
          .py-24 div .bg-primary\/10{
           top:0px;
          }

          /* Flex */
          .py-24 .px-4 > div > .flex{
           position:relative;
           top:-16px;
           transform:translatex(0px) translatey(-44px);
          }

          /* Division */
          .py-24 div .px-6{
           transform:translatex(35px) translatey(-63px) !important;
           position:relative;
           left:-33px;
          }

          /* Division */
          .py-24 .-translate-y-1\/2 .p-4{
           transform:translatex(394px) translatey(-199px);
           width:101%;
          }
        `}
      </style>
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative">
          {/* Central circle */}
          <div className="w-[600px] h-[600px] rounded-full bg-primary/10 mx-auto relative">
            {/* Animated elements */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-white rounded-lg shadow-lg">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <span className="font-semibold">Chapters</span>
              </div>
            </motion.div>

            {/* Collaborators */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute top-1/4 left-1/4"
            >
              <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-lg">
                <Users className="w-6 h-6 text-primary" />
                <span>Collaborators</span>
              </div>
            </motion.div>

            {/* Version Control */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute top-1/4 right-1/4"
            >
              <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-lg">
                <GitBranch className="w-6 h-6 text-primary" />
                <span>Versions</span>
              </div>
            </motion.div>

            {/* Connection lines */}
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                d="M300 300 L150 150"
                stroke="rgba(99, 102, 241, 0.2)"
                strokeWidth="2"
                fill="none"
              />
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
                d="M300 300 L450 150"
                stroke="rgba(99, 102, 241, 0.2)"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThesisVisualization;