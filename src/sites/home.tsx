import { Typewriter } from '@/components/typewriter'

export const Home = () => {
  return (
    <main class='grow container mx-auto flex flex-col items-center justify-center'>
      <h1 class='text-4xl font-bold'>Welcome to tvk.lol</h1>
      <Typewriter
        class='text-xl'
        duration={100}
        text='The portfolio site of Tamas Vince'
      />
      <hr class='w-1/2 my-4' />
      <p class='text-lg text-center max-w-xl'>
        Built with Preact and UnoCSS, bundled with rspack.
        <br />
        This is what a{' '}
        <a class='underline' href='https://motherfuckingwebsite.com/'>
          motherfucking portfolio
        </a>{' '}
        is.
      </p>
    </main>
  )
}
