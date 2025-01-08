/* src/index.css */
/* Import fonts with display swap and optional preloading */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;500;700&display=swap');
@import './styles/thesis.css';
@import './styles/editor.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Enhanced color palette with HSL values */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    
    /* Enhanced system properties */
    --radius: 0.5rem;
    --max-width: 1440px;
    --container-padding: 2rem;
    --header-height: 4rem;
    --footer-height: 4rem;
    
    /* Animation properties */
    --transition-fast: 150ms;
    --transition-normal: 250ms;
    --transition-slow: 350ms;
    --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  }

  .dark {
    /* Enhanced dark mode colors */
    --background: 215 28% 17%;
    --foreground: 210 40% 98%;
    --card: 217 33% 17%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    @apply antialiased scroll-smooth;
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  body {
    @apply bg-background text-foreground font-sans min-h-screen;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    line-height: 1.5;
  }
  
  /* Enhanced typography system */
  h1, h2, h3, h4, h5, h6 {
    @apply font-serif tracking-tight mb-4;
    font-family: 'Merriweather', serif;
    line-height: 1.2;
  }
  
  h1 {
    @apply text-4xl font-bold md:text-5xl lg:text-6xl;
    letter-spacing: -0.02em;
  }
  
  h2 {
    @apply text-3xl font-bold md:text-4xl lg:text-5xl;
    letter-spacing: -0.01em;
  }
  
  h3 {
    @apply text-2xl font-bold md:text-3xl lg:text-4xl;
  }
  
  h4 {
    @apply text-xl font-bold md:text-2xl lg:text-3xl;
  }
  
  h5 {
    @apply text-lg font-bold md:text-xl lg:text-2xl;
  }
  
  h6 {
    @apply text-base font-bold md:text-lg lg:text-xl;
  }
  
  p {
    @apply text-base leading-relaxed mb-4;
  }
  
  small {
    @apply text-sm leading-normal;
  }
  
  /* Enhanced link styles */
  a {
    @apply text-primary hover:text-primary/80 transition-colors duration-200;
    text-decoration-thickness: from-font;
  }
}

@layer utilities {
  /* Enhanced utility classes */
  .glass {
    @apply bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl;
    backdrop-filter: blur(12px);
  }
  
  .section-padding {
    @apply py-20 px-6 md:px-12 lg:px-24 max-w-[var(--max-width)] mx-auto;
  }
  
  /* Enhanced animations */
  .fade-in {
    @apply animate-[fadeIn_0.3s_ease-in-out];
  }
  
  .slide-in {
    @apply animate-[slideIn_0.3s_ease-in-out];
  }
  
  .slide-up {
    @apply animate-[slideUp_0.3s_ease-in-out];
  }
  
  .scale-in {
    @apply animate-[scaleIn_0.3s_ease-in-out];
  }
  
  /* Container queries utilities */
  @container (min-width: 640px) {
    .container-sm {
      @apply max-w-sm;
    }
  }
  
  @container (min-width: 768px) {
    .container-md {
      @apply max-w-md;
    }
  }
}

/* Enhanced prose styles */
.prose {
  @apply font-sans max-w-prose mx-auto;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  
  /* Enhanced content spacing */
  > * + * {
    @apply mt-4;
  }
  
  /* Enhanced list styles */
  ul, ol {
    @apply pl-6 mb-4;
  }
  
  li {
    @apply mb-2;
  }
}

.prose h1, 
.prose h2, 
.prose h3, 
.prose h4, 
.prose h5, 
.prose h6 {
  @apply font-serif font-bold;
  font-family: 'Merriweather', serif;
}

/* Enhanced dark mode styles */
.dark {
  .text-primary {
    @apply text-white transition-colors duration-200;
  }
  
  .text-secondary {
    @apply text-gray-300 transition-colors duration-200;
  }
  
  .text-muted {
    @apply text-gray-400 transition-colors duration-200;
  }
  
  /* Dark mode specific shadows */
  .shadow-custom {
    @apply shadow-[0_4px_20px_rgba(0,0,0,0.3)];
  }
}

/* Enhanced light mode styles */
.text-primary {
  @apply text-gray-900 transition-colors duration-200;
}

.text-secondary {
  @apply text-gray-700 transition-colors duration-200;
}

.text-muted {
  @apply text-gray-500 transition-colors duration-200;
}

/* Media query optimizations */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

@media print {
  .no-print {
    display: none !important;
  }
}