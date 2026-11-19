import { useEffect, useState } from 'react'
import { useReducedMotion } from 'motion/react'

/** Cycles 0..count-1 on an interval; holds still for reduced motion. */
export function useTicker(count: number, ms = 1600, active = true): number {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  useEffect(() => {
    if (reduce || !active) return
    const id = window.setInterval(() => setI((v) => (v + 1) % count), ms)
    return () => window.clearInterval(id)
  }, [count, ms, reduce, active])
  return reduce ? count - 1 : i
}
