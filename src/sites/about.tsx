import { Card } from '@/components/card'
import { H1, H2, P } from '@/components/typography'

export const About = () => {
  return (
    <main class='grow container mx-auto max-w-xl mt-24 px-8 space-y-4'>
      <header>
        <H1>About me</H1>
      </header>
      <Card as='section' aria-labelledby='about-description'>
        <P id='about-description'>
          I am a software engineer with a passion for building web applications.
          I have experience in various programming languages and frameworks, and
          I enjoy learning new technologies.
          <br />I have a strong background in anything digital ranging from live
          audio production to web development. I have meticulous standards for
          my work and I am always looking for ways to improve my skills.
        </P>
      </Card>
      <Card as='section' aria-labelledby='about-site-description'>
        <P id='about-site-description'>
          This site is built with Preact and UnoCSS, bundled with Rspack. It
          showcases my skills and projects as a software engineer.
          <br />
          The main goal was to keep the bundle size under 100kb, and I am happy
          to say that I achieved that goal.
        </P>
      </Card>
      <section aria-labelledby='skills-heading'>
        <H2
          id='skills-heading'
          class='scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0'
        >
          Skills
        </H2>
      </section>
    </main>
  )
}
