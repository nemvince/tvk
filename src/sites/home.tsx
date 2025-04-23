import { Typewriter } from '@/components/typewriter'

export const Home = () => {
  return (
    <div class='flex flex-col items-center justify-center'>
      <h1 class='text-4xl font-bold'>Welcome to tvk.lol</h1>
      <Typewriter duration={100} text='A place to watch TV shows and movies.' />
    </div>
  )
}
