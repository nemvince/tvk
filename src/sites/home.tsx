import { Card } from '@/components/card'
import { Typewriter } from '@/components/typewriter'
import { H1, H2, H3, P, Ul } from '@/components/typography'

export const Home = () => {
  return (
    <main class='grow w-full max-w-2xl mx-auto flex flex-col gap-6 px-4 py-8 sm:py-12'>
      <section class='flex flex-col items-start gap-2'>
        <H1 class='text-3xl sm:text-4xl font-bold tracking-tight'>
          Hi, I'm Tamas Vince
        </H1>
        <Typewriter
          class='text-base sm:text-lg'
          duration={60}
          text='Software Engineer, Web Enthusiast, Minimalist.'
        />
        <P class='text-sm text-gray-600 dark:text-gray-400 mt-2'>
          Building digital experiences with a focus on clarity, performance, and
          simplicity.
        </P>
      </section>

      <section class='flex flex-col gap-2'>
        <H2 class='text-xl font-semibold mb-1'>Philosophy</H2>
        <P class='text-sm text-gray-700 dark:text-gray-300'>
          I believe in building software that is fast, accessible, and easy to
          maintain. Minimalism in design and code leads to clarity and
          longevity. I value learning, sharing, and continuous improvement.
        </P>
      </section>

      <section class='flex flex-col gap-4'>
        <H2 class='text-xl font-semibold mb-1'>Skills</H2>
        <div class='grid grid-cols-2 sm:grid-cols-3 gap-3'>
          <Card>
            <span class='font-medium flex items-center gap-1.5'>
              <svg
                viewBox='0 0 15 15'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                width='15'
                height='15'
              >
                <title>TypeScript</title>
                <path
                  d='M12.5 8v-.167c0-.736-.597-1.333-1.333-1.333H10a1.5 1.5 0 100 3h1a1.5 1.5 0 010 3h-1A1.5 1.5 0 018.5 11M8 6.5H3m2.5 0V13M.5.5h14v14H.5V.5z'
                  stroke='currentColor'
                />
              </svg>
              TypeScript
            </span>
            <span class='text-xs text-gray-500'>3+ years</span>
          </Card>
          <Card>
            <span class='font-medium flex items-center gap-1.5'>
              <svg
                viewBox='0 0 15 15'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                width='15'
                height='15'
              >
                <title>React</title>
                <path
                  d='M14.5 7.584c0 1.657-3.134 3-7 3s-7-1.343-7-3 3.134-3 7-3 7 1.343 7 3z'
                  stroke='currentColor'
                />
                <path
                  d='M4.166 13.739c1.457.79 4.13-1.327 5.972-4.726 1.841-3.4 2.153-6.795.696-7.584-1.457-.79-4.13 1.327-5.972 4.726-1.841 3.4-2.153 6.795-.696 7.584z'
                  stroke='currentColor'
                />
                <path
                  d='M10.834 13.739c-1.457.79-4.13-1.327-5.972-4.726-1.841-3.4-2.153-6.795-.696-7.584 1.457-.79 4.13 1.327 5.972 4.726 1.841 3.4 2.153 6.795.696 7.584z'
                  stroke='currentColor'
                />
                <path
                  d='M6.5 7.584a1 1 0 102 0 1 1 0 00-2 0z'
                  stroke='currentColor'
                />
              </svg>
              React / Preact
            </span>
            <span class='text-xs text-gray-500'>
              SPA, SSR, hooks, performance
            </span>
          </Card>
          <Card>
            <span class='font-medium flex items-center gap-1.5'>
              <svg
                viewBox='0 0 15 15'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                width='15'
                height='15'
              >
                <title>Python</title>
                <path
                  d='M6 2.5h1M4.5 4V1.5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1h-4a1 1 0 00-1 1v5a1 1 0 001 1h4a1 1 0 001-1V11M8 4.5H1.5a1 1 0 00-1 1v5a1 1 0 001 1h3m2.5-1h6.5a1 1 0 001-1v-5a1 1 0 00-1-1h-3m-2.5 9h1'
                  stroke='currentColor'
                />
              </svg>
              Python
            </span>
            <span class='text-xs text-gray-500'>
              automation, scripting, web
            </span>
          </Card>
          <Card>
            <span class='font-medium flex items-center gap-1.5'>
              <svg
                viewBox='0 0 15 15'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                width='15'
                height='15'
              >
                <title>Linux</title>
                <path
                  d='M2.5 9.662c0-.758.224-1.498.645-2.129l.565-.847a7.203 7.203 0 001.07-2.583l.328-1.642a2.44 2.44 0 014.784 0l.329 1.642a7.18 7.18 0 001.07 2.583l.564.847c.42.63.645 1.371.645 2.129m-7.392 3.637c.386.13.8.201 1.23.201h2.324c.43 0 .844-.07 1.23-.201M6.5 5.5L4.947 8.606a2 2 0 001.79 2.894h1.527a2 2 0 001.789-2.894L8.5 5.5M6.5 3v1.5m2-1.5v1.5m-1.894-.053L5.5 5l.586.586a2 2 0 002.828 0L9.5 5l-1.106-.553a2 2 0 00-1.788 0zM.77 11.325l.479-1.196a1 1 0 01.928-.629h1.164a1 1 0 01.919.606l.93 2.172a1 1 0 01-.319 1.194l-.738.553a1 1 0 01-1.24-.031l-1.835-1.529a1 1 0 01-.288-1.14zm13.46 0l-.479-1.196a1 1 0 00-.928-.629h-1.164a1 1 0 00-.919.606l-.93 2.172a1 1 0 00.319 1.194l.738.553a1 1 0 001.24-.031l1.835-1.529a1 1 0 00.288-1.14z'
                  stroke='currentColor'
                />
              </svg>
              Linux
            </span>
            <span class='text-xs text-gray-500'>daily driver, server ops</span>
          </Card>
          <Card>
            <span class='font-medium flex items-center gap-1.5'>
              <svg
                viewBox='0 0 15 15'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                width='15'
                height='15'
              >
                <title>NextJS</title>
                <path
                  d='M4.5 4.5l.405-.293A.5.5 0 004 4.5h.5zm3 9.5A6.5 6.5 0 011 7.5H0A7.5 7.5 0 007.5 15v-1zM14 7.5A6.5 6.5 0 017.5 14v1A7.5 7.5 0 0015 7.5h-1zM7.5 1A6.5 6.5 0 0114 7.5h1A7.5 7.5 0 007.5 0v1zm0-1A7.5 7.5 0 000 7.5h1A6.5 6.5 0 017.5 1V0zM5 12V4.5H4V12h1zm-.905-7.207l6.5 9 .81-.586-6.5-9-.81.586zM10 4v6h1V4h-1z'
                  fill='currentColor'
                />
              </svg>
              Next.js
            </span>
            <span class='text-xs text-gray-500'>static & dynamic sites</span>
          </Card>
          <Card>
            <span class='font-medium flex items-center gap-1.5'>
              <svg
                viewBox='0 0 15 15'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                width='15'
                height='15'
              >
                <title>Svelte</title>
                <path
                  d='M9.625 8.357l-5.088 3.18m2.968-1.855a3.5 3.5 0 01-3.71-5.937l4.241-2.65A3.5 3.5 0 0112.405 6.5M7.536 5.296a3.5 3.5 0 013.71 5.936l-4.24 2.65A3.5 3.5 0 012.614 8.5m2.8-1.88l5.09-3.179'
                  stroke='currentColor'
                />
              </svg>
              Svelte
            </span>
            <span class='text-xs text-gray-500'>UI prototyping</span>
          </Card>
        </div>
      </section>

      <section class='flex flex-col gap-4'>
        <H2 class='text-xl font-semibold mb-1'>Experience</H2>
        <Card as='article'>
          <header>
            <H3 class='mb-0'>React Developer</H3>
            <P class='text-sm text-gray-500 mt-0'>2025–Present</P>
          </header>
          <Ul>
            <li>
              Built and maintained websites and web apps for small businesses
              and individuals
            </li>
            <li>Consulted on UI/UX, accessibility, and performance</li>
            <li>Automated workflows and deployments</li>
          </Ul>
        </Card>
      </section>
    </main>
  )
}
