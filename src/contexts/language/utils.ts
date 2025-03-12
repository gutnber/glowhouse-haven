
import { TranslationValue } from './types';

export function getTranslationValue(obj: any, path: string[]): string {
  let currentObj: any = obj;
  
  for (let i = 0; i < path.length; i++) {
    const part = path[i];
    if (currentObj && typeof currentObj === 'object' && part in currentObj) {
      currentObj = currentObj[part];
    } else {
      return path.join('.');
    }
  }
  
  return typeof currentObj === 'string' ? currentObj : path.join('.');
}

export function updateMetaTags(lang: string) {
  document.documentElement.lang = lang;
  
  const metaOgLocale = document.querySelector('meta[property="og:locale"]');
  const metaOgLocaleAlt = document.querySelector('meta[property="og:locale:alternate"]');
  
  if (metaOgLocale && metaOgLocaleAlt) {
    if (lang === 'es') {
      metaOgLocale.setAttribute('content', 'es_MX');
      metaOgLocaleAlt.setAttribute('content', 'en_US');
    } else {
      metaOgLocale.setAttribute('content', 'en_US');
      metaOgLocaleAlt.setAttribute('content', 'es_MX');
    }
  }
}
