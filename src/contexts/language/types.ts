
export type Language = 'en' | 'es';

export interface MetaTags {
  title: string;
  description: string;
  keywords: string;
}

export type TranslationValue = string | Record<string, string | Record<string, string>>;

export type TranslationsType = {
  [lang in Language]: {
    [key: string]: TranslationValue;
  }
};

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  getMetaTags: (path: string) => MetaTags;
}
