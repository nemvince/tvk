import { Card } from '@/components/card'
import { H1, H2, Ul } from '@/components/typography'
import '@/styles/competitions.css'

const competitions = [
  {
    place: 1,
    name: 'Codeforces Round #800',
    year: 2024,
    link: 'https://codeforces.com/',
  },
  {
    place: 2,
    name: 'Advent of Code',
    year: 2023,
    link: 'https://adventofcode.com/',
  },
  {
    place: 3,
    name: 'Google Code Jam',
    year: 2022,
    link: 'https://codingcompetitions.withgoogle.com/codejam',
  },
  {
    place: 4,
    name: 'Facebook Hacker Cup',
    year: 2021,
    link: 'https://www.facebook.com/codingcompetitions/hacker-cup',
  },
  {
    place: 5,
    name: 'ICPC Regional',
    year: 2020,
    link: 'https://icpc.global/',
  },
  {
    place: 6,
    name: 'Kaggle Competition',
    year: 2023,
    link: 'https://kaggle.com/',
  },
]

const podium = competitions.slice(0, 3)
const rest = competitions.slice(3)

export const Competitions = () => (
  <main class='grow w-full max-w-2xl mx-auto flex flex-col gap-8 px-4 py-8 sm:py-12'>
    <H1 class='mb-2'>Competitions</H1>
    <section class='flex flex-col gap-4'>
      <div class='relative flex flex-row justify-center items-end gap-2 w-full max-w-lg mx-auto h-48 sm:h-56 transition-all duration-500'>
        {podium.map((comp, i) => {
          const heights = ['h-40 md:h-48', 'h-32 md:h-36', 'h-28 md:h-32']
          const baseColors = [
            'bg-purple-400', // 1st
            'bg-purple-400/75', // 2nd
            'bg-purple-400/50', // 3rd
          ]
          const order = [2, 3, 1][i]
          return (
            <div
              key={comp.name}
              class={`flex flex-col items-center justify-end flex-1 transition-all duration-500 ${i === 0 ? 'z-10' : 'z-0'} order-${order}`}
              style={{
                animation: 'podiumFadeIn 0.7s cubic-bezier(.4,2,.6,1) both',
                animationDelay: `${i * 0.12 + 0.1}s`,
              }}
            >
              <div
                class={`w-full rounded-md ${heights[i]} ${baseColors[i]} flex flex-col items-center justify-end shadow-md`}
              >
                <span class='text-4xl font-bold -mt-4 block'>
                  {comp.place === 1 ? '🥇' : comp.place === 2 ? '🥈' : '🥉'}
                </span>
                <div class='grow flex justify-center items-center flex-col'>
                  <a href={comp.link} class='font-semibold text-center'>
                    {comp.name}
                  </a>
                  <span class='text-xs text-gray-700 dark:text-gray-200'>
                    {comp.year}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
    <section class='flex flex-col gap-2'>
      <H2 class='mb-1'>Other Results</H2>
      <Ul class='ml-0! list-none'>
        {rest.map(comp => (
          <li key={comp.name} class='mb-2'>
            <Card
              as='article'
              class='flex items-center flex-row! gap-4 p-4 rounded-lg shadow-sm bg-white dark:bg-gray-900 hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700'
            >
              <header class='rounded-full w-8 h-8 bg-purple-200 dark:bg-purple-500 flex items-center justify-center'>
                <span class='font-bold text-xl'>{comp.place}</span>
              </header>
              <div class='flex flex-col gap-1'>
                <a href={comp.link} class='font-semibold text-lg'>
                  {comp.name}
                </a>
                <span class='text-sm text-gray-500'>{comp.year}</span>
              </div>
            </Card>
          </li>
        ))}
      </Ul>
    </section>
  </main>
)
