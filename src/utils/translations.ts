export const translations = {
  en: {
    common: {
      login: "Login",
      signup: "Sign Up",
      features: "Features",
      about: "About",
      getStarted: "Get Started",
      home: "Home"
    },
    landing: {
      hero: {
        title: "Write Your Thesis with Confidence",
        subtitle: "A powerful platform for academic writing and collaboration",
        cta: "Start Writing Now"
      }
    }
  },
  fr: {
    common: {
      login: "Connexion",
      signup: "S'inscrire",
      features: "Fonctionnalités",
      about: "À propos",
      getStarted: "Commencer",
      home: "Accueil"
    },
    landing: {
      hero: {
        title: "Rédigez votre thèse en toute confiance",
        subtitle: "Une plateforme puissante pour la rédaction académique et la collaboration",
        cta: "Commencez à écrire"
      }
    }
  },
  ar: {
    common: {
      login: "تسجيل الدخول",
      signup: "إنشاء حساب",
      features: "المميزات",
      about: "حول",
      getStarted: "ابدأ الآن",
      home: "الرئيسية"
    },
    landing: {
      hero: {
        title: "اكتب أطروحتك بثقة",
        subtitle: "منصة قوية للكتابة الأكاديمية والتعاون",
        cta: "ابدأ الكتابة الآن"
      }
    }
  }
} as const;

export type Language = keyof typeof translations;