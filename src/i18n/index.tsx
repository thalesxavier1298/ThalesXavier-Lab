import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { en, type Dictionary } from './en'
import { pt } from './pt'
import { safeStorage } from '../lib/utils'

export type Lang = 'en' | 'pt'

const dictionaries: Record<Lang, Dictionary> = { en, pt }
const htmlLang: Record<Lang, string> = { en: 'en', pt: 'pt-BR' }
const STORAGE_KEY = 'tx-lang'

interface I18nValue {
  lang: Lang
  t: Dictionary
  setLang: (lang: Lang) => void
  toggleLang: () => void
}

const I18nContext = createContext<I18nValue | null>(null)

function initialLang(): Lang {
  const saved = safeStorage.get(STORAGE_KEY)
  return saved === 'pt' || saved === 'en' ? saved : 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  useEffect(() => {
    document.documentElement.lang = htmlLang[lang]
  }, [lang])

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    safeStorage.set(STORAGE_KEY, next)
  }, [])

  const toggleLang = useCallback(() => setLang(lang === 'en' ? 'pt' : 'en'), [lang, setLang])

  const value = useMemo(() => ({ lang, t: dictionaries[lang], setLang, toggleLang }), [lang, setLang, toggleLang])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider')
  return ctx
}
