import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, MemoryRouter } from 'react-router'
// Self-hosted fonts: no third-party requests, works offline.
import '@fontsource-variable/bricolage-grotesque/standard.css'
import '@fontsource/ibm-plex-sans/400.css'
import '@fontsource/ibm-plex-sans/400-italic.css'
import '@fontsource/ibm-plex-sans/500.css'
import '@fontsource/ibm-plex-sans/600.css'
import '@fontsource/ibm-plex-mono/400.css'
import './index.css'
import App from './App'
import { I18nProvider } from './i18n'
import { ThemeProvider } from './theme/ThemeProvider'

// Clean URLs (/about, /projects/...). Cloudflare serves index.html for unknown
// paths (wrangler.jsonc: not_found_handling = single-page-application).
// VITE_ROUTER=memory is only for the single-file preview, which has no real URL.
const Router = import.meta.env.VITE_ROUTER === 'memory' ? MemoryRouter : BrowserRouter

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <ThemeProvider>
        <I18nProvider>
          <App />
        </I18nProvider>
      </ThemeProvider>
    </Router>
  </StrictMode>,
)
