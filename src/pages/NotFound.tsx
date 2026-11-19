import { useI18n } from '../i18n'
import { ButtonLink } from '../components/ui'

export function NotFound() {
  const { t } = useI18n()
  return (
    <div className="shell flex min-h-[70vh] flex-col items-start justify-center gap-6 pt-28">
      <h1 className="t-xl max-w-[16ch]">{t.notFound.title}</h1>
      <p className="t-lede">{t.notFound.body}</p>
      <ButtonLink to="/">{t.notFound.cta}</ButtonLink>
    </div>
  )
}
