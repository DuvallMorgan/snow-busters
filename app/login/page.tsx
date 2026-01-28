'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isAnimating, setIsAnimating] = useState(false)
    const [showExplosion, setShowExplosion] = useState(false)

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()

        // Start snowball animation
        setIsAnimating(true)

        // After snowball reaches center, show explosion
        setTimeout(() => {
            setShowExplosion(true)
        }, 800)

        // After explosion, redirect to home
        setTimeout(() => {
            router.push('/')
        }, 2000)
    }

    return (
        <main className="container" style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {/* Snowball Animation Overlay */}
            {isAnimating && (
                <div className="snowball-overlay">
                    {!showExplosion ? (
                        <div className="snowball-projectile">⚪</div>
                    ) : (
                        <div className="explosion-container">
                            {/* Explosion particles */}
                            {[...Array(20)].map((_, i) => (
                                <div
                                    key={i}
                                    className="snow-particle"
                                    style={{
                                        '--angle': `${(i * 18)}deg`,
                                        '--delay': `${Math.random() * 0.2}s`,
                                        '--distance': `${100 + Math.random() * 150}px`,
                                        '--size': `${8 + Math.random() * 16}px`,
                                    } as React.CSSProperties}
                                >
                                    ❄️
                                </div>
                            ))}
                            {/* Center burst */}
                            <div className="burst-text">Welcome!</div>
                        </div>
                    )}
                </div>
            )}

            {/* Navigation */}
            <nav className="nav" style={{ position: 'absolute', top: 'var(--space-lg)', left: 'var(--space-lg)', right: 'var(--space-lg)' }}>
                <Link href="/" className="nav-logo">
                    ❄️ Snow<span>Buster</span>
                </Link>
            </nav>

            {/* Login Form */}
            <div className="animate-in" style={{ opacity: isAnimating ? 0.3 : 1, transition: 'opacity 0.3s', pointerEvents: isAnimating ? 'none' : 'auto' }}>
                <div className="text-center" style={{ marginBottom: 'var(--space-2xl)' }}>
                    <div style={{ fontSize: '4rem', marginBottom: 'var(--space-md)' }}>⛄</div>
                    <h1 style={{ marginBottom: 'var(--space-sm)' }}>Welcome Back!</h1>
                    <p>Sign in to manage your snow clearing</p>
                </div>

                <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div style={{ marginBottom: 'var(--space-lg)', textAlign: 'right' }}>
                            <a href="#" className="text-sm text-accent" style={{ textDecoration: 'none' }}>
                                Forgot password?
                            </a>
                        </div>

                        <button type="submit" className="btn btn-primary btn-block btn-large">
                            🎿 Sign In
                        </button>
                    </form>

                    <div className="text-center" style={{ marginTop: 'var(--space-xl)' }}>
                        <p className="text-sm text-muted">
                            Don't have an account?{' '}
                            <a href="#" className="text-accent" style={{ textDecoration: 'none', fontWeight: 600 }}>
                                Sign up
                            </a>
                        </p>
                    </div>
                </div>

                {/* Social Login Options */}
                <div className="text-center animate-in animate-delay-2" style={{ marginTop: 'var(--space-xl)' }}>
                    <p className="text-sm text-muted" style={{ marginBottom: 'var(--space-md)' }}>Or continue with</p>
                    <div className="flex justify-center gap-md">
                        <button className="btn btn-secondary" style={{ padding: 'var(--space-md)' }}>
                            <span style={{ fontSize: '1.25rem' }}>📱</span>
                        </button>
                        <button className="btn btn-secondary" style={{ padding: 'var(--space-md)' }}>
                            <span style={{ fontSize: '1.25rem' }}>✉️</span>
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .snowball-overlay {
                    position: fixed;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    pointer-events: none;
                }

                .snowball-projectile {
                    font-size: 4rem;
                    animation: snowball-fly 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                    filter: drop-shadow(0 4px 20px rgba(59, 130, 246, 0.5));
                }

                @keyframes snowball-fly {
                    0% {
                        transform: translateY(-100vh) scale(0.5) rotate(0deg);
                        opacity: 1;
                    }
                    80% {
                        transform: translateY(0) scale(1.5) rotate(720deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(0) scale(2) rotate(720deg);
                        opacity: 0;
                    }
                }

                .explosion-container {
                    position: relative;
                    width: 300px;
                    height: 300px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .snow-particle {
                    position: absolute;
                    font-size: var(--size);
                    animation: explode 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    animation-delay: var(--delay);
                }

                @keyframes explode {
                    0% {
                        transform: translate(0, 0) scale(0) rotate(0deg);
                        opacity: 1;
                    }
                    50% {
                        opacity: 1;
                    }
                    100% {
                        transform: 
                            translate(
                                calc(cos(var(--angle)) * var(--distance)), 
                                calc(sin(var(--angle)) * var(--distance))
                            ) 
                            scale(1) 
                            rotate(360deg);
                        opacity: 0;
                    }
                }

                .burst-text {
                    font-family: 'DM Sans', sans-serif;
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: #3b82f6;
                    animation: burst-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                    text-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
                }

                @keyframes burst-in {
                    0% {
                        transform: scale(0);
                        opacity: 0;
                    }
                    50% {
                        transform: scale(1.3);
                    }
                    100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
            `}</style>
        </main>
    )
}
