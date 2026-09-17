import { useAegis } from './useAegisState';
import { translations, Translations } from '../data/translations';

export function useTranslation(): { t: Translations; currentLang: string } {
  const { profile } = useAegis();
  const lang = profile?.language || 'en';
  const t = translations[lang] || translations.en;
  return { t, currentLang: lang };
}
