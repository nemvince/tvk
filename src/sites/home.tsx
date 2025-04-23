import { ThemeToggle } from "@/components/theme"

export const Home = () => {
  return (
    <div class='flex flex-col items-center justify-center'>
      <ThemeToggle />
      <h1 class='text-4xl font-bold'>Welcome to tvk.lol</h1>
    </div>
  )
}