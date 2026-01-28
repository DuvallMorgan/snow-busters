import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'SnowBuster - On-Demand Snow Removal',
    description: 'Get your snow cleared in minutes. Connect with local snow busters ready to help.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                <Snowfall />
                {children}
            </body>
        </html>
    )
}

// Animated snowfall background component
function Snowfall() {
    const snowflakes = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 8 + Math.random() * 10,
        size: 0.5 + Math.random() * 0.5,
    }))

    return (
        <div className="snowfall" aria-hidden="true">
            {snowflakes.map((flake) => (
                <span
                    key={flake.id}
                    className="snowflake"
                    style={{
                        left: `${flake.left}%`,
                        animationDelay: `${flake.delay}s`,
                        animationDuration: `${flake.duration}s`,
                        fontSize: `${flake.size}rem`,
                    }}
                >
                    ❄
                </span>
            ))}
        </div>
    )
}
