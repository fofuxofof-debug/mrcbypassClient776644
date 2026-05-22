'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { login } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { KeyRound, Loader2 } from 'lucide-react'

const initialState = {
  error: '',
}

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, initialState)

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-[#050505] p-6 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />

      <div className="relative w-full max-w-[400px]">
        <div className="mb-10 flex flex-col items-center gap-2">
          <Link href="/" className="group flex flex-col items-center transition-all duration-500">
            <span className="text-4xl font-black text-white tracking-tighter uppercase transition-colors">
              mrc<span className="text-primary">Client</span>
            </span>
            <div className="h-[1px] w-12 bg-primary/30 mt-1 transition-all duration-500 group-hover:w-24 group-hover:bg-white" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-600 mt-3">Access Terminal</span>
          </Link>
        </div>

        <div className="animate-slide-up rounded-[32px] border border-white/[0.03] bg-[#0a0a0a]/80 p-10 shadow-2xl backdrop-blur-xl" style={{ animationDelay: '0.2s' }}>
          <form action={formAction} className="flex flex-col gap-8">
            <div className="space-y-6">
              <div className="flex flex-col gap-2.5">
                <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 px-1">
                  Identity
                </Label>
                <div className="relative group">
                  <Input
                    id="email"
                    name="email"
                    type="text"
                    required
                    placeholder="Username or Email"
                    className="h-13 border-white/[0.05] bg-black/40 rounded-2xl text-sm tracking-wide placeholder:text-neutral-800 transition-all focus:border-white/20 focus:ring-0"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 px-1">
                  Access Key
                </Label>
                <div className="relative group">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="h-13 border-white/[0.05] bg-black/40 rounded-2xl text-sm tracking-widest placeholder:text-neutral-800 transition-all focus:border-white/20 focus:ring-0"
                  />
                </div>
              </div>
            </div>

            {state?.error && (
              <p className="text-center text-xs font-bold uppercase tracking-wider text-destructive/80 animate-pulse">
                {state.error}
              </p>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="h-14 w-full rounded-2xl bg-white text-black font-black uppercase tracking-[0.15em] text-xs transition-all duration-300 hover:bg-neutral-200 active:scale-[0.98]"
            >
              {isPending ? 'Authenticating...' : 'Authorize Access'}
            </Button>
          </form>
        </div>

        <Link 
          href="/" 
          className="mt-10 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-600 transition-colors hover:text-white"
        >
          <div className="h-px w-4 bg-neutral-800 transition-all group-hover:w-8 group-hover:bg-white" />
          Return to Store
        </Link>
      </div>
    </div>
  )
}
