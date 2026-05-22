'use client'

import { useEffect, useState, useRef } from 'react'

export function AnimatedCursor() {
    const [isPointer, setIsPointer] = useState(false)
    const cursorRef = useRef<HTMLDivElement>(null)
    const mousePos = useRef({ x: 0, y: 0 })
    const cursorActualPos = useRef({ x: 0, y: 0 })

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mousePos.current = { x: e.clientX, y: e.clientY }
            
            const target = e.target as HTMLElement
            const isClickable = window.getComputedStyle(target).cursor === 'pointer' || 
                              target.closest('a') || 
                              target.closest('button') ||
                              target.tagName === 'INPUT' ||
                              target.tagName === 'TEXTAREA' ||
                              target.closest('.cursor-pointer')
            setIsPointer(!!isClickable)
        }

        const animate = () => {
            // Direct positioning for 0 lag / maximum lightness
            cursorActualPos.current.x = mousePos.current.x
            cursorActualPos.current.y = mousePos.current.y

            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate3d(${cursorActualPos.current.x}px, ${cursorActualPos.current.y}px, 0)`
            }

            requestAnimationFrame(animate)
        }

        window.addEventListener('mousemove', handleMouseMove)
        const animationId = requestAnimationFrame(animate)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            cancelAnimationFrame(animationId)
        }
    }, [])

    return (
        <>
            <div
                ref={cursorRef}
                className="pointer-events-none fixed top-0 left-0 z-[10000] flex items-center justify-center"
                style={{
                    width: '20px',
                    height: '20px',
                    marginLeft: '-10px',
                    marginTop: '-10px',
                    willChange: 'transform'
                }}
            >
                {/* Vertical Line of the "+" */}
                <div 
                    className="absolute bg-white"
                    style={{
                        width: '1px',
                        height: isPointer ? '16px' : '10px',
                        opacity: isPointer ? 1 : 0.6,
                    }}
                />
                {/* Horizontal Line of the "+" */}
                <div 
                    className="absolute bg-white"
                    style={{
                        width: isPointer ? '16px' : '10px',
                        height: '1px',
                        opacity: isPointer ? 1 : 0.6,
                    }}
                />
            </div>

            <style jsx global>{`
                body, a, button, input, textarea, [role="button"], .cursor-pointer {
                    cursor: none !important;
                }
            `}</style>
        </>
    )
}
