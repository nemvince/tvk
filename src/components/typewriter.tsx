import { useEffect, useState } from 'preact/hooks'

interface TypewriterProps {
  duration: number
  text: string
  class?: string
}

export const Typewriter = ({ duration, text, class: cn }: TypewriterProps) => {
  const [displayText, setDisplayText] = useState('')
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prevText => prevText + text[index])
        setIndex(prevIndex => prevIndex + 1)
      }, duration)

      return () => clearTimeout(timeout)
    }
  }, [duration, index, text])

  // &nbsp; required to not collapse when empty
  return (
    <span class={`$${cn ? `${cn} ` : ''}text-accent`}>&nbsp;{displayText}</span>
  )
}
