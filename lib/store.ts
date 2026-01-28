// ═══════════════════════════════════════════════════════════════════════════
// SNOWBUSTER - Data Types & Storage Utilities
// ═══════════════════════════════════════════════════════════════════════════

export type ServiceType = 'driveway' | 'walkway' | 'car_digout' | 'combo'
export type JobStatus = 'pending' | 'accepted' | 'completed' | 'cancelled'

export interface Job {
    id: string
    status: JobStatus

    // Customer info
    customerName: string
    customerPhone: string
    address: string

    // Service details
    serviceType: ServiceType
    price: number

    // Worker info (null until accepted)
    workerName: string | null
    workerPhone: string | null

    // Rating (null until completed and rated)
    rating: number | null

    // Timestamps
    createdAt: string
    acceptedAt: string | null
    completedAt: string | null

    // AI recommendation
    aiRecommendation: string | null
}

export interface Worker {
    name: string
    phone: string
}

// ══════════════ PRICING ══════════════
export const PRICING: Record<ServiceType, number> = {
    driveway: 45,
    walkway: 25,
    car_digout: 35,
    combo: 85,
}

export const SERVICE_LABELS: Record<ServiceType, string> = {
    driveway: 'Driveway Clearing',
    walkway: 'Walkway Clearing',
    car_digout: 'Car Dig-Out',
    combo: 'Full Package (All Services)',
}

// ══════════════ MOCK AI RECOMMENDATIONS ══════════════
const AI_RECOMMENDATIONS = [
    "⚠️ Heavy snowfall expected in the next 2 hours. Consider prioritizing this job to avoid deeper accumulation.",
    "🌡️ Temperature rising to 35°F this afternoon. Snow may become heavier and wetter - recommend completing before noon.",
    "❄️ Current conditions: Light powder snow, ideal for quick clearing. Estimated completion: 25 minutes.",
    "🌬️ Wind advisory in effect. Recommend clearing downwind edges first to prevent re-accumulation.",
    "🧊 Ice layer detected under snow. Suggest applying salt treatment after clearing for safety.",
    "☀️ Sunny breaks expected at 2 PM. If possible, schedule completion before refreezing at dusk.",
    "🌨️ Continuous light snow forecasted. Customer may need follow-up service in 4-6 hours.",
    "⛄ Perfect packing snow! Quick tip: This type clears easily with a standard push shovel.",
]

export function generateAIRecommendation(): string {
    return AI_RECOMMENDATIONS[Math.floor(Math.random() * AI_RECOMMENDATIONS.length)]
}

// ══════════════ STORAGE KEYS ══════════════
const JOBS_KEY = 'snowbuster_jobs'
const WORKER_KEY = 'snowbuster_worker'

// ══════════════ JOB OPERATIONS ══════════════
export function getJobs(): Job[] {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(JOBS_KEY)
    return data ? JSON.parse(data) : []
}

export function saveJobs(jobs: Job[]): void {
    localStorage.setItem(JOBS_KEY, JSON.stringify(jobs))
    // Dispatch storage event for cross-tab sync
    window.dispatchEvent(new StorageEvent('storage', { key: JOBS_KEY }))
}

export function getJob(id: string): Job | undefined {
    return getJobs().find(j => j.id === id)
}

export function createJob(data: {
    customerName: string
    customerPhone: string
    address: string
    serviceType: ServiceType
}): Job {
    const job: Job = {
        id: generateId(),
        status: 'pending',
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        address: data.address,
        serviceType: data.serviceType,
        price: PRICING[data.serviceType],
        workerName: null,
        workerPhone: null,
        rating: null,
        createdAt: new Date().toISOString(),
        acceptedAt: null,
        completedAt: null,
        aiRecommendation: generateAIRecommendation(),
    }

    const jobs = getJobs()
    jobs.push(job)
    saveJobs(jobs)

    return job
}

export function acceptJob(jobId: string, worker: Worker): Job | null {
    const jobs = getJobs()
    const index = jobs.findIndex(j => j.id === jobId)

    if (index === -1 || jobs[index].status !== 'pending') return null

    jobs[index] = {
        ...jobs[index],
        status: 'accepted',
        workerName: worker.name,
        workerPhone: worker.phone,
        acceptedAt: new Date().toISOString(),
    }

    saveJobs(jobs)
    return jobs[index]
}

export function completeJob(jobId: string): Job | null {
    const jobs = getJobs()
    const index = jobs.findIndex(j => j.id === jobId)

    if (index === -1 || jobs[index].status !== 'accepted') return null

    jobs[index] = {
        ...jobs[index],
        status: 'completed',
        completedAt: new Date().toISOString(),
    }

    saveJobs(jobs)
    return jobs[index]
}

export function rateJob(jobId: string, rating: number): Job | null {
    const jobs = getJobs()
    const index = jobs.findIndex(j => j.id === jobId)

    if (index === -1 || jobs[index].status !== 'completed') return null

    jobs[index] = {
        ...jobs[index],
        rating,
    }

    saveJobs(jobs)
    return jobs[index]
}

// ══════════════ WORKER OPERATIONS ══════════════
export function getWorker(): Worker | null {
    if (typeof window === 'undefined') return null
    const data = localStorage.getItem(WORKER_KEY)
    return data ? JSON.parse(data) : null
}

export function saveWorker(worker: Worker): void {
    localStorage.setItem(WORKER_KEY, JSON.stringify(worker))
}

// ══════════════ UTILITIES ══════════════
export function generateId(): string {
    return `SB-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
}

export function formatPrice(price: number): string {
    return `$${price.toFixed(0)}`
}

export function formatTime(isoString: string): string {
    return new Date(isoString).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    })
}

export function formatDate(isoString: string): string {
    return new Date(isoString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    })
}

// ══════════════ STATS ══════════════
export function getStats() {
    const jobs = getJobs()

    return {
        total: jobs.length,
        pending: jobs.filter(j => j.status === 'pending').length,
        active: jobs.filter(j => j.status === 'accepted').length,
        completed: jobs.filter(j => j.status === 'completed').length,
        revenue: jobs
            .filter(j => j.status === 'completed')
            .reduce((sum, j) => sum + j.price, 0),
        avgRating: jobs.filter(j => j.rating).length > 0
            ? jobs.filter(j => j.rating).reduce((sum, j) => sum + (j.rating || 0), 0) / jobs.filter(j => j.rating).length
            : 0,
    }
}

export function getWorkerStats(workerName: string) {
    const jobs = getJobs().filter(j => j.workerName === workerName)

    return {
        active: jobs.filter(j => j.status === 'accepted').length,
        completed: jobs.filter(j => j.status === 'completed').length,
        earnings: jobs
            .filter(j => j.status === 'completed')
            .reduce((sum, j) => sum + j.price, 0),
    }
}
