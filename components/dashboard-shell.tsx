'use client'

import React from "react"

import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { logout } from '@/app/actions/auth'
import {
  LayoutDashboard,
  Key,
  Activity,
  LogOut,
  Menu,
  Monitor,
  Settings,
  X,
  Bot,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/sessions', label: 'Sessões', icon: Monitor },
  { href: '/dashboard/keys', label: 'Keys', icon: Key },
  { href: '/dashboard/logs', label: 'Logs', icon: Activity },
  { href: '/dashboard/bot', label: 'Bot', icon: Bot },
  { href: '/dashboard/settings', label: 'Configurações', icon: Settings },
]

interface User {
  id: string
  email?: string
  role?: string
  user_metadata?: {
    name?: string
  }
}

export function DashboardShell({
  user,
  children,
}: {
  user: User
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
  }

  // Filter items based on role
  const filteredNavItems = user.role === 'limited'
    ? navItems.filter(item => ['/dashboard', '/dashboard/sessions', '/dashboard/keys'].includes(item.href))
    : navItems;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-border bg-[#0f0f0f] md:flex">
        <Link
          href="/"
          className="flex h-16 items-center gap-3 border-b border-white/5 px-6 transition-colors"
        >
          <span className="text-xl font-bold text-primary tracking-tighter uppercase">mrcClient</span>
        </Link>

        <nav className="flex flex-1 flex-col gap-1 p-4">
          {filteredNavItems.map((item, index) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`animate-slide-up flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 ${isActive
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                  }`}
                style={{ animationDelay: `${0.1 + index * 0.05}s` }}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}

          <div className="mt-auto pt-4 border-t border-white/5">
            <button
              onClick={handleLogout}
              className="animate-slide-up mt-4 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              style={{ animationDelay: `${0.1 + navItems.length * 0.05}s` }}
            >
              <LogOut className="h-4 w-4" />
              Sair da conta
            </button>
          </div>
        </nav>
      </aside>

      {/* Mobile Header */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-[#0c0c0c] px-4 md:hidden">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <span className="text-xl font-bold text-primary tracking-tighter uppercase">mrcClient</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </header>

        {/* Mobile Nav Overlay */}
        {mobileOpen && (
          <div className="border-b border-border bg-[#0f0f0f] p-4 md:hidden">
            <nav className="flex flex-col gap-1">
              {filteredNavItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 ${isActive
                      ? 'bg-primary text-white shadow-lg'
                      : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                      }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
              <div className="mt-3 border-t border-white/5 pt-3">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98]"
                >
                  <LogOut className="h-4 w-4" />
                  Sair da conta
                </button>
              </div>
            </nav>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-background p-4 md:py-8 md:pr-8 md:pl-6">
          <div className="max-w-[1600px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
