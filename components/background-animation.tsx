'use client'

export function BackgroundAnimation() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Base Background #080808 */}
            <div className="absolute inset-0 bg-[#080808]"></div>

            {/* Animated Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-900/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob"></div>
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-900/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-pink-800/15 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-4000"></div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:32px_32px]"></div>
        </div>
    )
}
