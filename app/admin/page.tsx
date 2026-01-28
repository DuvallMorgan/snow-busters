'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    getJobs,
    getStats,
    formatPrice,
    formatDate,
    SERVICE_LABELS,
    Job
} from '@/lib/store'

export default function AdminPage() {
    const [jobs, setJobs] = useState<Job[]>([])
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        active: 0,
        completed: 0,
        revenue: 0,
        avgRating: 0,
    })
    const [statusFilter, setStatusFilter] = useState<string>('all')

    // Poll for updates
    useEffect(() => {
        const refreshData = () => {
            setJobs(getJobs())
            setStats(getStats())
        }

        refreshData()
        const interval = setInterval(refreshData, 1000)

        const handleStorage = () => refreshData()
        window.addEventListener('storage', handleStorage)

        return () => {
            clearInterval(interval)
            window.removeEventListener('storage', handleStorage)
        }
    }, [])

    const filteredJobs = statusFilter === 'all'
        ? jobs
        : jobs.filter(j => j.status === statusFilter)

    const acceptanceRate = stats.total > 0
        ? ((stats.active + stats.completed) / stats.total * 100).toFixed(0)
        : '0'

    const completionRate = (stats.active + stats.completed) > 0
        ? (stats.completed / (stats.active + stats.completed) * 100).toFixed(0)
        : '0'

    return (
        <main className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '960px' }}>
            {/* Navigation */}
            <nav className="nav">
                <Link href="/" className="nav-logo">
                    ❄️ Snow<span>Buster</span>
                </Link>
                <span className="badge badge-active">Admin</span>
            </nav>

            {/* Header */}
            <section className="animate-in" style={{ marginBottom: 'var(--space-xl)' }}>
                <h2>Platform Dashboard</h2>
                <p>Real-time overview of all Snow Buster activity.</p>
            </section>

            {/* Stats Grid */}
            <div className="stats-grid animate-in animate-delay-1" style={{ marginBottom: 'var(--space-xl)' }}>
                <div className="card stat-card">
                    <div className="stat-value">{stats.total}</div>
                    <div className="stat-label">Total Jobs</div>
                </div>
                <div className="card stat-card">
                    <div className="stat-value" style={{ color: 'var(--status-pending)' }}>{stats.pending}</div>
                    <div className="stat-label">Pending</div>
                </div>
                <div className="card stat-card">
                    <div className="stat-value" style={{ color: 'var(--status-active)' }}>{stats.active}</div>
                    <div className="stat-label">Active</div>
                </div>
                <div className="card stat-card">
                    <div className="stat-value" style={{ color: 'var(--status-complete)' }}>{stats.completed}</div>
                    <div className="stat-label">Completed</div>
                </div>
            </div>

            {/* Revenue & Metrics */}
            <div className="stats-grid animate-in animate-delay-2" style={{ marginBottom: 'var(--space-xl)' }}>
                <div className="card stat-card" style={{ gridColumn: 'span 2' }}>
                    <div className="stat-value">{formatPrice(stats.revenue)}</div>
                    <div className="stat-label">Total Revenue</div>
                </div>
                <div className="card stat-card">
                    <div className="stat-value">{acceptanceRate}%</div>
                    <div className="stat-label">Acceptance Rate</div>
                </div>
                <div className="card stat-card">
                    <div className="stat-value">{completionRate}%</div>
                    <div className="stat-label">Completion Rate</div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="tabs animate-in animate-delay-3" style={{ marginBottom: 'var(--space-lg)' }}>
                {['all', 'pending', 'accepted', 'completed'].map(status => (
                    <button
                        key={status}
                        className={`tab ${statusFilter === status ? 'active' : ''}`}
                        onClick={() => setStatusFilter(status)}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                ))}
            </div>

            {/* Jobs Table */}
            <div className="card animate-in animate-delay-4" style={{ padding: 0, overflow: 'hidden' }}>
                {filteredJobs.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📊</div>
                        <p>No jobs to display.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    <th style={thStyle}>Job ID</th>
                                    <th style={thStyle}>Status</th>
                                    <th style={thStyle}>Service</th>
                                    <th style={thStyle}>Customer</th>
                                    <th style={thStyle}>Worker</th>
                                    <th style={{ ...thStyle, textAlign: 'right' }}>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredJobs.map(job => (
                                    <tr key={job.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={tdStyle}>
                                            <span className="mono text-xs">{job.id}</span>
                                        </td>
                                        <td style={tdStyle}>
                                            <span className={`badge badge-${job.status === 'accepted' ? 'active' : job.status === 'completed' ? 'complete' : 'pending'}`}>
                                                {job.status}
                                            </span>
                                        </td>
                                        <td style={tdStyle}>
                                            <span className="text-sm">{SERVICE_LABELS[job.serviceType]}</span>
                                        </td>
                                        <td style={tdStyle}>
                                            <span className="text-sm">{job.customerName}</span>
                                        </td>
                                        <td style={tdStyle}>
                                            <span className="text-sm text-muted">{job.workerName || '—'}</span>
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: 'right' }}>
                                            <span className="mono text-accent">{formatPrice(job.price)}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Average Rating */}
            {stats.avgRating > 0 && (
                <div className="card animate-in" style={{ marginTop: 'var(--space-lg)', textAlign: 'center' }}>
                    <p className="text-sm text-muted" style={{ marginBottom: 'var(--space-xs)' }}>Average Customer Rating</p>
                    <p style={{ fontSize: '1.5rem' }}>
                        <span style={{ color: 'var(--status-pending)' }}>★</span> {stats.avgRating.toFixed(1)} / 5.0
                    </p>
                </div>
            )}
        </main>
    )
}

const thStyle: React.CSSProperties = {
    padding: 'var(--space-md)',
    textAlign: 'left',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--frost-400)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
}

const tdStyle: React.CSSProperties = {
    padding: 'var(--space-md)',
}
