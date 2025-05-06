import type { ComponentChildren, JSX } from 'preact'

export interface CardProps {
  class?: string
  children: ComponentChildren
  as?: keyof JSX.IntrinsicElements
}

export const Card = ({
  class: className = '',
  children,
  as = 'section',
  ...rest
}: CardProps) => {
  const Tag = as as keyof JSX.IntrinsicElements
  return (
    <Tag
      class={`flex flex-col gap-1 p-3 rounded border border-gray-200 dark:border-gray-600 bg-accent ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}
