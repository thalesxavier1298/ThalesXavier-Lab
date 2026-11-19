import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { scrollToId } from './utils'

/**
 * Navigate to a section on the home page. Section targets travel through
 * router state, so URLs stay clean (/, /about, /projects).
 */
export function useSectionNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return useCallback(
    (id: string) => {
      if (pathname === '/') scrollToId(id)
      else navigate('/', { state: { scrollTo: id } })
    },
    [navigate, pathname],
  )
}
