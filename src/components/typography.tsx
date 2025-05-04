import type { JSX } from 'preact'

export const H1 = (props: JSX.HTMLAttributes<HTMLHeadingElement>) => (
  <h1
    {...props}
    class={`scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl${props.class ? ` ${props.class}` : ''}`}
  />
)

export const H2 = (props: JSX.HTMLAttributes<HTMLHeadingElement>) => (
  <h2
    {...props}
    class={`scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0${props.class ? ` ${props.class}` : ''}`}
  />
)

export const H3 = (props: JSX.HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    {...props}
    class={`scroll-m-20 text-2xl font-semibold tracking-tight${props.class ? ` ${props.class}` : ''}`}
  />
)

export const H4 = (props: JSX.HTMLAttributes<HTMLHeadingElement>) => (
  <h4
    {...props}
    class={`scroll-m-20 text-xl font-semibold tracking-tight${props.class ? ` ${props.class}` : ''}`}
  />
)

export const P = (props: JSX.HTMLAttributes<HTMLParagraphElement>) => (
  <p
    {...props}
    class={`leading-7 [&:not(:first-child)]:mt-6${props.class ? ` ${props.class}` : ''}`}
  />
)

export const Blockquote = (props: JSX.HTMLAttributes<HTMLQuoteElement>) => (
  <blockquote
    {...props}
    class={`mt-6 border-l-2 pl-6 italic${props.class ? ` ${props.class}` : ''}`}
  />
)

export const Ul = (props: JSX.HTMLAttributes<HTMLUListElement>) => (
  <ul
    {...props}
    class={`my-6 ml-6 list-disc [&>li]:mt-2${props.class ? ` ${props.class}` : ''}`}
  />
)

export const InlineCode = (props: JSX.HTMLAttributes<HTMLElement>) => (
  <code
    {...props}
    class={`relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold${props.class ? ` ${props.class}` : ''}`}
  />
)
