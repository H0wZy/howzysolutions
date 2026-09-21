import type { Locale } from '../content/i18n/types'
import { translate } from '../locale'

export function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="footer">
      <div className="wrap">
        <p className="dim">{translate(locale, 'footer.builtWith')}</p>
      </div>
    </footer>
  )
}
