'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import { Search } from 'lucide-react'

export function Navbar() {
  const [searchId, setSearchId] = useState('')
  const router = useRouter()
  const pathname = usePathname()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchId.trim()) {
      router.push(`/children/${searchId.trim()}`)
      setSearchId('')
    }
  }

  const linkStyles = (path: string) => {
    const isActive = pathname === path
    return `
      text-white text-[13px] md:text-sm font-bold uppercase tracking-[0.15em] 
      transition-all py-2 px-4 rounded-md border-2
      ${isActive 
        ? 'border-white bg-white/10' 
        : 'border-transparent hover:border-white/30'
      }
    `
  }

  return (
    <nav className="w-full bg-[#004a80] px-4 md:px-10 h-24 flex items-center justify-between shadow-lg">
      
      <div className="flex-shrink-0">
        <Link href="/dashboard">
          <Image 
            src="/nav/logo-pref-2025.png" 
            alt="Logo" 
            width={180} 
            height={60}
            className="h-auto w-auto max-h-16"
          />
        </Link>
      </div>

      <div className="flex items-center gap-6">
        
        <form 
          onSubmit={handleSearch} 
          className="relative flex items-center bg-white rounded-full px-4 h-10 w-48 md:w-64"
        >
          <input
            type="text"
            placeholder="Pesquisar id"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
          />
          <button type="submit" className="ml-2 text-gray-400 hover:text-[#004a80]">
            <Search size={18} />
          </button>
        </form>

        <div className="flex gap-2">
          <Link href="/dashboard" className={linkStyles('/dashboard')}>
            Dashboard
          </Link>
          
          <Link href="/children" className={linkStyles('/children')}>
            Crianças
          </Link>
        </div>
      </div>
    </nav>
  )
}