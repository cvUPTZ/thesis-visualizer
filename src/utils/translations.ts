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
        cta: "Start Writing Now",
        learnMore: "Learn More"
      },
      features: {
        title: "Powerful Features for Academic Success",
        subtitle: "Everything you need to write a professional thesis",
        smartEditor: {
          title: "Smart Editor",
          description: "Write and format your thesis with our intelligent editor"
        },
        collaboration: {
          title: "Real-time Collaboration",
          description: "Work together with advisors and peers seamlessly"
        },
        versionControl: {
          title: "Version Control",
          description: "Track changes and manage different versions effortlessly"
        },
        aiPowered: {
          title: "AI-Powered",
          description: "Get intelligent suggestions and formatting assistance"
        }
      },
      pricing: {
        title: "Choose Your Plan",
        subtitle: "Select the perfect plan for your academic journey",
        basic: {
          title: "Basic",
          price: "0 DZD",
          duration: "one thesis"
        },
        standard: {
          title: "Standard",
          price: "3,900 DZD",
          duration: "per thesis"
        },
        research: {
          title: "Research",
          price: "13,900 DZD",
          duration: "yearly"
        }
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
        cta: "Commencer à écrire",
        learnMore: "En savoir plus"
      },
      features: {
        title: "Des fonctionnalités puissantes pour la réussite académique",
        subtitle: "Tout ce dont vous avez besoin pour rédiger une thèse professionnelle",
        smartEditor: {
          title: "Éditeur intelligent",
          description: "Rédigez et formatez votre thèse avec notre éditeur intelligent"
        },
        collaboration: {
          title: "Collaboration en temps réel",
          description: "Travaillez ensemble avec vos directeurs et pairs de manière transparente"
        },
        versionControl: {
          title: "Contrôle de version",
          description: "Suivez les modifications et gérez différentes versions sans effort"
        },
        aiPowered: {
          title: "Propulsé par l'IA",
          description: "Obtenez des suggestions intelligentes et une assistance au formatage"
        }
      },
      pricing: {
        title: "Choisissez votre forfait",
        subtitle: "Sélectionnez le forfait parfait pour votre parcours académique",
        basic: {
          title: "Basique",
          price: "0 DZD",
          duration: "une thèse"
        },
        standard: {
          title: "Standard",
          price: "3 900 DZD",
          duration: "par thèse"
        },
        research: {
          title: "Recherche",
          price: "13 900 DZD",
          duration: "par an"
        }
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
        cta: "ابدأ الكتابة الآن",
        learnMore: "اعرف المزيد"
      },
      features: {
        title: "ميزات قوية للنجاح الأكاديمي",
        subtitle: "كل ما تحتاجه لكتابة أطروحة احترافية",
        smartEditor: {
          title: "محرر ذكي",
          description: "اكتب ونسق أطروحتك مع محررنا الذكي"
        },
        collaboration: {
          title: "تعاون في الوقت الفعلي",
          description: "اعمل مع المشرفين والزملاء بسلاسة"
        },
        versionControl: {
          title: "التحكم في الإصدارات",
          description: "تتبع التغييرات وإدارة الإصدارات المختلفة بسهولة"
        },
        aiPowered: {
          title: "مدعوم بالذكاء الاصطناعي",
          description: "احصل على اقتراحات ذكية ومساعدة في التنسيق"
        }
      },
      pricing: {
        title: "اختر خطتك",
        subtitle: "اختر الخطة المثالية لرحلتك الأكاديمية",
        basic: {
          title: "أساسي",
          price: "0 دج",
          duration: "أطروحة واحدة"
        },
        standard: {
          title: "قياسي",
          price: "3,900 دج",
          duration: "لكل أطروحة"
        },
        research: {
          title: "بحث",
          price: "13,900 دج",
          duration: "سنويا"
        }
      }
    }
  }
} as const;

export type Language = keyof typeof translations;