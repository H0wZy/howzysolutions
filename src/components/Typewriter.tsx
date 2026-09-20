import { useEffect, useState } from 'react'

export function Typewriter({ phrases }: { phrases: string[] }) {
  const [index, setIndex] = useState(0)
  const [subIndex, setSubIndex] = useState(phrases[0]?.length ?? 0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!phrases || phrases.length <= 1) return

    // Honor reduced-motion preference: keep static full text
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const current = phrases[index] ?? ''

    if (!isDeleting && subIndex === current.length) {
      const timeout = setTimeout(() => setIsDeleting(true), 2000)
      return () => clearTimeout(timeout)
    }

    if (isDeleting && subIndex === 0) {
      const timeout = setTimeout(() => {
        setIsDeleting(false)
        setIndex((prev) => (prev + 1) % phrases.length)
      }, 400)
      return () => clearTimeout(timeout)
    }

    const speed = isDeleting ? 30 : 65
    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1))
    }, speed)

    return () => clearTimeout(timeout)
  }, [subIndex, isDeleting, index, phrases])

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
