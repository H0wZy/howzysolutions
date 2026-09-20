import { useEffect, useState } from 'react'

export function Typewriter({ phrases }: { phrases: string[] }) {
  const [index, setIndex] = useState(0)
  const [subIndex, setSubIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const startTimeout = setTimeout(() => setStarted(true), 300)
    return () => clearTimeout(startTimeout)
  }, [])

  useEffect(() => {
    if (!started || !phrases || phrases.length === 0) return

    const current = phrases[index] ?? ''

    if (!isDeleting && subIndex === current.length) {
      const timeout = setTimeout(() => setIsDeleting(true), 2200)
      return () => clearTimeout(timeout)
    }

    if (isDeleting && subIndex === 0) {
      const timeout = setTimeout(() => {
        setIsDeleting(false)
        setIndex((prev) => (prev + 1) % phrases.length)
      }, 400)
      return () => clearTimeout(timeout)
    }

    const speed = isDeleting ? 25 : 55
    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1))
    }, speed)

    return () => clearTimeout(timeout)
  }, [started, subIndex, isDeleting, index, phrases])

  if (!phrases || phrases.length === 0) return null

  const text = phrases[index]?.slice(0, subIndex) ?? ''

  return (
    <span className="typewriter">
      <span className="typewriter-text">{text}</span>
      <span className="cursor" aria-hidden="true">
        ▋
      </span>
    </span>
  )
}
