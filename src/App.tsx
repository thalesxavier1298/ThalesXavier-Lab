import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { Navigate, Route, Routes, useLocation } from 'react-router'
import { Nav } from './components/Nav'
import { ContactSection, Footer } from './components/Sections'
import { Home } from './pages/Home'
import { Work } from './pages/Work'
import { CaseStudy } from './pages/CaseStudy'
import { About } from './pages/About'
import { NotFound } from './pages/NotFound'

export default function App() {
  const location = useLocation()

  const onExitComplete = () => {
    // New page starts at the top unless it is heading to a section.
    if (!(location.state as { scrollTo?: string } | null)?.scrollTo) window.scrollTo(0, 0)
  }

  return (
    // reducedMotion="user": transforms are dropped for visitors who ask for less motion.
    <MotionConfig reducedMotion="user">
      <Nav />
      <main id="main" tabIndex={-1} className="outline-none">
        <AnimatePresence mode="wait" initial={false} onExitComplete={onExitComplete}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Work />} />
              <Route path="/projects/:slug" element={<CaseStudy />} />
              <Route path="/about" element={<About />} />
              {/* Routes from the previous site, kept so old links and search results still land */}
              <Route path="/education" element={<Navigate to="/about" replace />} />
              <Route path="/experience" element={<Navigate to="/about" replace />} />
              <Route path="/skills" element={<Navigate to="/" replace state={{ scrollTo: 'skills' }} />} />
              <Route path="/contact" element={<Navigate to="/" replace state={{ scrollTo: 'contact' }} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
        <ContactSection />
      </main>
      <Footer />
    </MotionConfig>
  )
}
