import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { 
  Presentation, 
  Video, 
  Play, 
  SkipBack, 
  SkipForward, 
  Fullscreen,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

interface Slide {
  title: string;
  description: string;
  icon: React.ReactNode;
  animation: string;
}

export const PlatformPresentation = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const { t } = useTranslation();
  const { language } = useLanguage();

  const slides: Slide[] = [
    {
      title: t('presentation.welcome'),
      description: t('presentation.welcomeDesc'),
      icon: <Presentation className="w-12 h-12 text-primary" />,
      animation: 'fade'
    },
    {
      title: t('presentation.editor'),
      description: t('presentation.editorDesc'),
      icon: <Video className="w-12 h-12 text-primary" />,
      animation: 'slide'
    },
    {
      title: t('presentation.collaboration'),
      description: t('presentation.collaborationDesc'),
      icon: <Play className="w-12 h-12 text-primary" />,
      animation: 'scale'
    }
  ];

  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => {
        if (currentSlide < slides.length - 1) {
          setCurrentSlide(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentSlide, isPlaying, slides.length]);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const slideVariants = {
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      exit: { opacity: 0 }
    },
    slide: {
      hidden: { x: 100, opacity: 0 },
      visible: { x: 0, opacity: 1 },
      exit: { x: -100, opacity: 0 }
    },
    scale: {
      hidden: { scale: 0.8, opacity: 0 },
      visible: { scale: 1, opacity: 1 },
      exit: { scale: 0.8, opacity: 0 }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-background to-muted">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {t('presentation.title')}
          </DialogTitle>
          <DialogDescription className="text-center">
            {t('presentation.subtitle')}
          </DialogDescription>
        </DialogHeader>

        <div className="relative overflow-hidden rounded-lg p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              variants={slideVariants[slides[currentSlide].animation]}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center text-center space-y-4"
            >
              {slides[currentSlide].icon}
              <h3 className="text-xl font-semibold">
                {slides[currentSlide].title}
              </h3>
              <p className="text-muted-foreground">
                {slides[currentSlide].description}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center items-center space-x-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              disabled={currentSlide === 0}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <SkipBack className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex justify-center mt-4">
            {slides.map((_, index) => (
              <motion.div
                key={index}
                className={`w-2 h-2 rounded-full mx-1 ${
                  currentSlide === index ? 'bg-primary' : 'bg-muted-foreground'
                }`}
                animate={{
                  scale: currentSlide === index ? 1.2 : 1,
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};