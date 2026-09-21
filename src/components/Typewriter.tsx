import { useEffect, useState } from 'react'

export function Typewriter({ phrases }: { phrases: string[] }) {
  const [index, setIndex] = useState(0)
  const [subIndex, setSubIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!phrases?.length) return
    const current = phrases[index] ?? ''

    if (!isDeleting && subIndex === current.length) {
      const t = setTimeout(() => setIsDeleting(true), 2200)
      return () => clearTimeout(t)
    }

    if (isDeleting && subIndex === 0) {
      const t = setTimeout(() => {
        setIsDeleting(false)
        setIndex((prev) => (prev + 1) % phrases.length)
      }, 400)
      return () => clearTimeout(t)
    }

    const t = setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1))
    }, isDeleting ? 25 : 55)

    return () => clearTimeout(t)
  }, [subIndex, isDeleting, index, phrases])

  if (!phrases?.length) return null

  return (
    <span className="typewriter">
      <span className="typewriter-text">{phrases[index]?.slice(0, subIndex) ?? ''}</span>
      <span className="cursor" aria-hidden="true">▋</span>
    </span>
  )
}
