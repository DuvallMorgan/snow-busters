'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
    getJob,
    rateJob,
    formatPrice,
    formatDate,
    SERVICE_LABELS,
    Job
} from '@/lib/store'

export default function TrackJobPage() {
    const params = useParams()
    const jobId = params.id as string
    const [job, setJob] = useState<Job | null>(null)
    const [selectedRating, setSelectedRating] = useState(0)
    const [hasRated, setHasRated] = useState(false)

    // Poll for job updates
    useEffect(() => {
        const fetchJob = () => {
            const currentJob = getJob(jobId)
            if (currentJob) {
                setJob(currentJob)
                if (currentJob.rating) {
                    setSelectedRating(currentJob.rating)
                    setHasRated(true)
                }
            }
        }

        fetchJob()
        const interval = setInterval(fetchJob, 1000)

        // Also listen to storage events for cross-tab sync
        const handleStorage = () => fetchJob()
        window.addEventListener('storage', handleStorage)

        return () => {
            clearInterval(interval)
            window.removeEventListener('storage', handleStorage)
        }
    }, [jobId])

    const handleRate = (rating: number) => {
        if (hasRated || !job || job.status !== 'completed') return
        setSelectedRating(rating)
        rateJob(jobId, rating)
        setHasRated(true)
    }

    if (!job) {
        return (
            <main className="container" style={{ position: 'relative', zIndex: 1 }}>
                <nav className="nav">
                    <Link href="/" className="nav-logo">
                        ❄️ Snow<span>Buster</span>
                    </Link>
                </nav>
                <div className="empty-state">
                    <div className="empty-state-icon">🔍</div>
                    <p>Loading job details...</p>
                </div>
            </main>
        )
    }

    const statusConfig = {
        pending: { icon: '⏳', label: 'Waiting for a Buster', color: 'var(--status-pending)' },
        accepted: { icon: '🚶', label: 'Buster on the way!', color: 'var(--status-active)' },
        completed: { icon: '✅', label: 'Job Completed', color: 'var(--status-complete)' },
        cancelled: { icon: '❌', label: 'Cancelled', color: 'var(--status-urgent)' },
    }

    const status = statusConfig[job.status]

    return (
        <main className="container" style={{ position: 'relative', zIndex: 1 }}>
            {/* Navigation */}
            <nav className="nav">
                <Link href="/" className="nav-logo">
                    ❄️ Snow<span>Buster</span>
                </Link>
            </nav>

            {/* Job ID Header */}
            <section className="animate-in" style={{ marginBottom: 'var(--space-xl)' }}>
                <p className="mono text-sm text-muted" style={{ marginBottom: 'var(--space-xs)' }}>
                    Job #{job.id}
                </p>
                <h2>Track Your Request</h2>
            </section>

            {/* Status Card */}
            <div
                className="card animate-in animate-delay-1"
                style={{
                    borderLeft: `4px solid ${status.color}`,
                    marginBottom: 'var(--space-lg)'
                }}
            >
                <div className="flex items-center gap-md">
                    <span style={{ fontSize: '2.5rem' }}>{status.icon}</span>
                    <div>
                        <h3 style={{ color: status.color }}>{status.label}</h3>
                        <p className="text-sm">{formatDate(job.createdAt)}</p>
                    </div>
                </div>
            </div>

            {/* Job Details */}
            <div className="card animate-in animate-delay-2" style={{ marginBottom: 'var(--space-lg)' }}>
                <h4 style={{ marginBottom: 'var(--space-md)' }}>Job Details</h4>

                <div className="flex flex-col gap-md">
                    <div className="flex justify-between">
                        <span className="text-muted">Service</span>
                        <span>{SERVICE_LABELS[job.serviceType]}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted">Address</span>
                        <span style={{ textAlign: 'right', maxWidth: '60%' }}>{job.address}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted">Price</span>
                        <span className="mono text-accent" style={{ fontWeight: 600 }}>
                            {formatPrice(job.price)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Worker Info (when accepted) */}
            {job.workerName && (
                <div className="card card-glow animate-in" style={{ marginBottom: 'var(--space-lg)' }}>
                    <h4 style={{ marginBottom: 'var(--space-md)' }}>Your Snow Buster</h4>
                    <div className="flex items-center gap-md">
                        <div
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 'var(--radius-full)',
                                background: 'var(--accent-glow)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem'
                            }}
                        >
                            💪
                        </div>
                        <div>
                            <p style={{ fontWeight: 600 }}>{job.workerName}</p>
                            <p className="text-sm text-muted mono">{job.workerPhone}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* AI Recommendation */}
            {job.aiRecommendation && (
                <div className="ai-card animate-in animate-delay-3" style={{ marginBottom: 'var(--space-lg)' }}>
                    <div className="ai-card-title">
                        🤖 AI Weather Insight
                    </div>
                    <p className="ai-card-content">{job.aiRecommendation}</p>
                </div>
            )}

            {/* Rating (when completed) */}
            {job.status === 'completed' && (
                <div className="card animate-in" style={{ marginBottom: 'var(--space-xl)' }}>
                    <h4 style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>
                        {hasRated ? 'Thanks for rating!' : 'How was your experience?'}
                    </h4>
                    <div className="rating" style={{ justifyContent: 'center' }}>
                        {[1, 2, 3, 4, 5].map(star => (
                            <button
                                key={star}
                                type="button"
                                className={`star ${selectedRating >= star ? 'active' : ''}`}
                                onClick={() => handleRate(star)}
                                disabled={hasRated}
                                style={{ background: 'none', border: 'none' }}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Back Button */}
            <Link href="/" className="btn btn-secondary btn-block" style={{ marginBottom: 'var(--space-xl)' }}>
                ← Back to Home
            </Link>
        </main>
    )
}
