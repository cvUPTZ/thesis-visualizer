import { useState, useEffect, useCallback } from 'react';
import { Mutex } from 'async-mutex';

const mutex = new Mutex();

export const useContentStabilization = (
  initialContent: string,
  onStabilized: (content: string) => void,
  delay: number = 500
) => {
  const [content, setContent] = useState(initialContent);
  const [isStabilizing, setIsStabilizing] = useState(false);

  const stabilizeContent = useCallback(async (newContent: string) => {
    await mutex.acquire();
    try {
      setIsStabilizing(true);
      console.log('Stabilizing content:', newContent);
      setContent(newContent);
      onStabilized(newContent);
    } finally {
      setIsStabilizing(false);
      mutex.release();
    }
  }, [onStabilized]);

  useEffect(() => {
    if (content !== initialContent) {
      const timer = setTimeout(() => {
        stabilizeContent(content);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [content, initialContent, delay, stabilizeContent]);

  return {
    content,
    setContent,
    isStabilizing
  };
};