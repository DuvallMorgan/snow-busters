'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
    getJobs,
    getWorker,
    saveWorker,
    acceptJob,
    completeJob,
    getWorkerStats,
    formatPrice,
    formatDate,
    SERVICE_LABELS,
    Job,
    Worker
} from '@/lib/store'

type TabType = 'available' | 'active' | 'completed'

export default function WorkerPage() {
    const [worker, setWorker] = useState<Worker | null>(null)
    const [workerForm, setWorkerForm] = useState({ name: '', phone: '' })
    const [jobs, setJobs] = useState<Job[]>([])
    const [activeTab, setActiveTab] = useState<TabType>('available')
    const [stats, setStats] = useState({ active: 0, completed: 0, earnings: 0 })

    // Load worker from localStorage on mount
    useEffect(() => {
        const savedWorker = getWorker()
        if (savedWorker) {
            setWorker(savedWorker)
        }
    }, [])

    // Poll for job updates
    const refreshData = useCallback(() => {
        setJobs(getJobs())
        if (worker) {
            setStats(getWorkerStats(worker.name))
        }
    }, [worker])

    useEffect(() => {
        refreshData()
        const interval = setInterval(refreshData, 1000)

        const handleStorage = () => refreshData()
        window.addEventListener('storage', handleStorage)

        return () => {
            clearInterval(interval)
            window.removeEventListener('storage', handleStorage)
        }
    }, [refreshData])

    const handleWorkerSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const newWorker = { name: workerForm.name, phone: workerForm.phone }
        saveWorker(newWorker)
        setWorker(newWorker)
    }

    const handleAccept = (jobId: string) => {
        if (!worker) return
        acceptJob(jobId, worker)
        refreshData()
        setActiveTab('active')
    }

    const handleComplete = (jobId: string) => {
        completeJob(jobId)
        refreshData()
        setActiveTab('completed')
    }

    // Filter jobs based on active tab
    const filteredJobs = jobs.filter(job => {
        if (activeTab === 'available') return job.status === 'pending'
        if (activeTab === 'active') return job.status === 'accepted' && job.workerName === worker?.name
        if (activeTab === 'completed') return job.status === 'completed' && job.workerName === worker?.name
        return false
    })

    // Worker registration screen
    if (!worker) {
        return (
            <main className="container" style={{ position: 'relative', zIndex: 1 }}>
                <nav className="nav">
                    <Link href="/" className="nav-logo">
                        ❄️ Snow<span>Buster</span>
                    </Link>
                </nav>

                <section className="animate-in" style={{ marginBottom: 'var(--space-xl)' }}>
                    <h2>Become a Buster</h2>
                    <p>Enter your details to start accepting jobs.</p>
                </section>

                <form onSubmit={handleWorkerSubmit} className="animate-in animate-delay-1">
                    <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
                        <div className="form-group">
                            <label className="form-label">Your Name</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Jane Doe"
                                value={workerForm.name}
                                onChange={e => setWorkerForm(prev => ({ ...prev, name: e.target.value }))}
                                required
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Phone Number</label>
                            <input
                                type="tel"
                                className="form-input"
                                placeholder="(555) 987-6543"
                                value={workerForm.phone}
                                onChange={e => setWorkerForm(prev => ({ ...prev, phone: e.target.value }))}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-large btn-block">
                        💪 Start Finding Jobs
                    </button>
                </form>
            </main>
        )
    }

    // Main worker dashboard
    return (
        <main className="container" style={{ position: 'relative', zIndex: 1 }}>
            {/* Navigation */}
            <nav className="nav">
                <Link href="/" className="nav-logo">
                    ❄️ Snow<span>Buster</span>
                </Link>
                <span className="text-sm text-muted">Hi, {worker.name.split(' ')[0]}!</span>
            </nav>

            {/* Stats Cards */}
            <div className="stats-grid animate-in" style={{ marginBottom: 'var(--space-xl)' }}>
                <div className="card stat-card">
                    <div className="stat-value">{stats.active}</div>
                    <div className="stat-label">Active</div>
                </div>
                <div className="card stat-card">
                    <div className="stat-value">{stats.completed}</div>
                    <div className="stat-label">Completed</div>
                </div>
                <div className="card stat-card" style={{ gridColumn: 'span 2' }}>
                    <div className="stat-value">{formatPrice(stats.earnings)}</div>
                    <div className="stat-label">Total Earnings</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs animate-in animate-delay-1">
                <button
                    className={`tab ${activeTab === 'available' ? 'active' : ''}`}
                    onClick={() => setActiveTab('available')}
                >
                    Available ({jobs.filter(j => j.status === 'pending').length})
                </button>
                <button
                    className={`tab ${activeTab === 'active' ? 'active' : ''}`}
                    onClick={() => setActiveTab('active')}
                >
                    Active ({stats.active})
                </button>
                <button
                    className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('completed')}
                >
                    Done ({stats.completed})
                </button>
            </div>

            {/* Jobs List */}
            <div className="jobs-list animate-in animate-delay-2">
                {filteredJobs.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            {activeTab === 'available' ? '🔍' : activeTab === 'active' ? '⏳' : '📝'}
                        </div>
                        <p>
                            {activeTab === 'available' && 'No jobs available right now. Check back soon!'}
                            {activeTab === 'active' && 'No active jobs. Accept one to get started!'}
                            {activeTab === 'completed' && 'No completed jobs yet. Get out there and bust some snow!'}
                        </p>
                    </div>
                ) : (
                    filteredJobs.map(job => (
                        <div key={job.id} className="card job-card">
                            <div className="job-card-header">
                                <div>
                                    <p className="job-address">{job.address}</p>
                                    <p className="job-service">{SERVICE_LABELS[job.serviceType]}</p>
                                </div>
                                <span className="job-price">{formatPrice(job.price)}</span>
                            </div>

                            {/* AI Recommendation */}
                            {job.aiRecommendation && activeTab === 'available' && (
                                <div className="ai-card" style={{ padding: 'var(--space-sm) var(--space-md)', fontSize: '0.8125rem' }}>
                                    <span className="ai-card-title" style={{ fontSize: '0.6875rem', marginBottom: 'var(--space-xs)' }}>
                                        🤖 AI Insight
                                    </span>
                                    <p className="ai-card-content" style={{ fontSize: '0.8125rem' }}>{job.aiRecommendation}</p>
                                </div>
                            )}

                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted mono">{formatDate(job.createdAt)}</span>

                                {activeTab === 'available' && (
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleAccept(job.id)}
                                    >
                                        Accept Job
                                    </button>
                                )}

                                {activeTab === 'active' && (
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleComplete(job.id)}
                                    >
                                        ✓ Mark Complete
                                    </button>
                                )}

                                {activeTab === 'completed' && job.rating && (
                                    <span className="badge badge-complete">
                                        ★ {job.rating}/5
                                    </span>
                                )}
                            </div>

                            {/* Customer contact info for active jobs */}
                            {activeTab === 'active' && (
                                <div style={{
                                    marginTop: 'var(--space-sm)',
                                    paddingTop: 'var(--space-sm)',
                                    borderTop: '1px solid rgba(255,255,255,0.05)'
                                }}>
                                    <p className="text-xs text-muted">Customer Contact</p>
                                    <p className="text-sm">{job.customerName} • <span className="mono">{job.customerPhone}</span></p>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </main>
    )
}
