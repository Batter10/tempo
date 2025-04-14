import Link from 'next/link'
import { Button } from './ui/button'
import { Bot } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="w-full border-b border-gray-200 bg-white py-2">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" prefetch className="text-xl font-bold flex items-center gap-2">
          <Bot className="h-6 w-6 text-blue-600" />
          <span>Slimme Assistent</span>
        </Link>
        <div className="flex gap-4 items-center">
          <Link
            href="/dashboard"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  )
}
