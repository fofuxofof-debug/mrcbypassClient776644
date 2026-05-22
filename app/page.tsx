import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background text-white selection:bg-primary/30 overflow-hidden">

      <nav className="animate-slide-down fixed top-0 z-50 flex h-20 w-full items-center justify-between border-b border-white/5 bg-[#0c0c0c]/80 px-6 backdrop-blur-xl md:px-12">
        <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
          <span className="text-xl font-bold text-primary tracking-tighter uppercase">mrcClient</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden items-center gap-8 md:flex absolute left-1/2 -translate-x-1/2">
          <Link href="/" className="text-sm font-medium text-neutral-400 transition-all hover:text-white px-3 py-1.5 rounded-lg">
            Home
          </Link>
          <Link href="https://discord.gg/XUgTFcacTW" target="_blank" className="text-sm font-medium text-neutral-400 transition-all hover:text-white px-3 py-1.5 rounded-lg">
            Showcase
          </Link>
          <Link href="https://discord.gg/XUgTFcacTW" target="_blank" className="text-sm font-medium text-neutral-400 transition-all hover:text-white px-3 py-1.5 rounded-lg">
            Features
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="rounded-xl bg-primary px-6 py-2 text-sm font-bold text-white transition-all hover:scale-105 hover:bg-primary/80 hover:shadow-[0_0_25px_rgba(255,0,127,0.6)] active:scale-95"
          >
            Dashboard
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-20 flex flex-1 items-center justify-center">
        <style dangerouslySetInnerHTML={{
          __html: `
          .hero-title {
            font-size: clamp(1.5rem, 5vw, 2.5rem) !important;
            line-height: 1.2 !important;
            text-wrap: balance !important;
            font-weight: 700 !important;
            font-family: var(--font-outfit), sans-serif !important;
            margin-bottom: 1rem !important;
          }
          .hero-subtitle {
            font-size: clamp(1rem, 2.5vw, 1.2rem) !important;
            font-family: var(--font-inter), sans-serif !important;
            max-width: 800px !important;
            margin: 0 auto 2rem auto !important;
          }
        ` }} />
        <div className="relative flex flex-col items-center text-center px-6">
          <h1 className="hero-title animate-slide-up relative text-white" style={{ animationDelay: '0.2s' }}>
            Ultimate <span className="text-primary">ScreenShare Bypass</span> Solution with MrcClient
          </h1>
          <p className="hero-subtitle animate-slide-up font-medium text-neutral-500" style={{ animationDelay: '0.4s' }}>
            Advanced invisibility technology for professional tools and privacy.
          </p>
        </div>
      </main>


      {/* Footer */}
      <footer className="relative z-20 py-8 text-center text-sm text-neutral-700">
        <div className="mb-4 flex justify-center gap-6">
          <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
        </div>
        &copy; {new Date().getFullYear()} mrcClient. All rights reserved.
      </footer>
    </div >
  )
}

