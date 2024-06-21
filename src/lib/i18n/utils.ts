import { ui, defaultLang } from './ui';

export function getLangFromUrl(url: Pick<URL, 'pathname'>) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  }
}

type AbsolutePathname = `/${string}`

export function relativeLink(
  pathname: AbsolutePathname,
  url: Pick<URL, 'pathname'>
) {
  return `/${getLangFromUrl(url)}${pathname}`
}