'use client'

import Link from 'next/link'
import { PRICING, formatPrice, SERVICE_LABELS, ServiceType } from '@/lib/store'

export default function HomePage() {
    return (
        <main className="container" style={{ position: 'relative', zIndex: 1 }}>
            {/* Navigation */}
            <nav className="nav">
                <Link href="/" className="nav-logo">
                    ❄️ Snow<span>Buster</span>
                </Link>
                <Link href="/admin" className="text-sm text-muted" style={{ textDecoration: 'none' }}>
                    Admin
                </Link>
            </nav>

            {/* Hero Section */}
            <section className="text-center animate-in" style={{ marginTop: 'var(--space-xl)' }}>
                <div className="hero-emoji" style={{ marginBottom: 'var(--space-md)' }}>🏠❄️</div>
                <h1 style={{ marginBottom: 'var(--space-md)' }}>
                    Snow Cleared<br />In Minutes
                </h1>
                <p style={{ fontSize: '1.125rem', maxWidth: '320px', margin: '0 auto var(--space-2xl)' }}>
                    On-demand snow removal at your fingertips. Local busters ready to help.
                </p>
            </section>

            {/* Role Selection Cards */}
            <div className="flex flex-col gap-lg animate-in animate-delay-2">
                {/* Customer Card - Primary CTA */}
                <Link href="/customer" style={{ textDecoration: 'none' }}>
                    <div className="card card-glow" style={{ cursor: 'pointer' }}>
                        <div className="flex items-center gap-md" style={{ marginBottom: 'var(--space-md)' }}>
                            <span style={{ fontSize: '2.5rem' }}>🏠</span>
                            <div>
                                <h3 style={{ marginBottom: 'var(--space-xs)', color: 'var(--accent-primary)' }}>I Need Snow Cleared</h3>
                                <p className="text-sm">Get help in minutes, not hours</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted">Starting at {formatPrice(PRICING.walkway)}</span>
                            <span className="text-accent" style={{ fontSize: '1.5rem' }}>→</span>
                        </div>
                    </div>
                </Link>

                {/* Worker Card */}
                <Link href="/worker" style={{ textDecoration: 'none' }}>
                    <div className="card" style={{ cursor: 'pointer' }}>
                        <div className="flex items-center gap-md" style={{ marginBottom: 'var(--space-md)' }}>
                            <span style={{ fontSize: '2.5rem' }}>💪</span>
                            <div>
                                <h3 style={{ marginBottom: 'var(--space-xs)' }}>I'm a Snow Buster</h3>
                                <p className="text-sm">Find jobs & start earning</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted">Earn up to {formatPrice(PRICING.combo)}/job</span>
                            <span className="text-accent" style={{ fontSize: '1.5rem' }}>→</span>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Pricing Preview */}
            <section className="animate-in animate-delay-3" style={{ marginTop: 'var(--space-3xl)' }}>
                <h4 className="text-center" style={{ marginBottom: 'var(--space-lg)', color: 'var(--text-secondary)' }}>
                    💰 Transparent Pricing
                </h4>
                <div className="card">
                    <div className="flex flex-col gap-md">
                        {(Object.keys(PRICING) as ServiceType[]).map((service) => (
                            <div key={service} className="flex justify-between items-center" style={{ padding: 'var(--space-sm) 0', borderBottom: service !== 'combo' ? '1px solid var(--bg-mist)' : 'none' }}>
                                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{SERVICE_LABELS[service]}</span>
                                <span className="mono text-accent" style={{ fontWeight: 700 }}>
                                    {formatPrice(PRICING[service])}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* AI Feature Tease */}
            <section className="animate-in animate-delay-4" style={{ marginTop: 'var(--space-2xl)', marginBottom: 'var(--space-3xl)' }}>
                <div className="ai-card">
                    <div className="ai-card-title">
                        <span>🤖</span> AI-Powered Insights
                    </div>
                    <p className="ai-card-content">
                        Our smart system analyzes weather conditions to provide optimal timing recommendations for your snow clearing job.
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="text-center text-muted text-xs" style={{ marginTop: 'var(--space-3xl)', paddingBottom: 'var(--space-xl)' }}>
                <p>Built for NYC Snow Days ❄️</p>
            </footer>
        </main>
    )
}
