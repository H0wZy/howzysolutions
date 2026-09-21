import { useEffect, useState } from 'react'

export function Typewriter({ phrases }: { phrases: string[] }) {
  const [index, setIndex] = useState(0)
  const [subIndex, setSubIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!phrases?.length) return
    const current = phrases[index] ?? ''
    const atEnd = !isDeleting && subIndex === current.length
    const atStart = isDeleting && subIndex === 0

    const t = setTimeout(
      () => {
        if (atEnd) setIsDeleting(true)
        else if (atStart) {
          setIsDeleting(false)
          setIndex((prev) => (prev + 1) % phrases.length)
        } else {
          setSubIndex((prev) => prev + (isDeleting ? -1 : 1))
        }
      },
      atEnd ? 2200 : atStart ? 400 : isDeleting ? 25 : 55,
    )

    return () => clearTimeout(t)
  }, [subIndex, isDeleting, index, phrases])

  if (!phrases?.length) return null

  return (
    <span className="typewriter">
      <span className="typewriter-text">{phrases[index]?.slice(0, subIndex) ?? ''}</span>
      <span className="cursor" aria-hidden="true">
        ▋
      </span>
    </span>
  )
}
