import { ThemeToggle } from './theme-toggle'

export function Navbar() {
  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <h1 className="text-xl font-bold">💪 Push-Up Challenge</h1>
        <ThemeToggle />
      </div>
    </nav>
  )
}
