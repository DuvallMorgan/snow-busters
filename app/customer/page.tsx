'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    createJob,
    PRICING,
    SERVICE_LABELS,
    formatPrice,
    ServiceType
} from '@/lib/store'

export default function CustomerPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        customerName: '',
        customerPhone: '',
        address: '',
        serviceType: 'driveway' as ServiceType,
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate network delay for better UX
        await new Promise(resolve => setTimeout(resolve, 500))

        const job = createJob(formData)
        router.push(`/customer/track/${job.id}`)
    }

    const updateField = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <main className="container" style={{ position: 'relative', zIndex: 1 }}>
            {/* Navigation */}
            <nav className="nav">
                <Link href="/" className="nav-logo">
                    ❄️ Snow<span>Buster</span>
                </Link>
            </nav>

            {/* Header */}
            <section className="animate-in" style={{ marginBottom: 'var(--space-xl)' }}>
                <h2>Request Snow Clearing</h2>
                <p>Fill in your details and we'll match you with a nearby buster.</p>
            </section>

            {/* Form */}
            <form onSubmit={handleSubmit} className="animate-in animate-delay-1">
                <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
                    <div className="form-group">
                        <label className="form-label">Your Name</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="John Smith"
                            value={formData.customerName}
                            onChange={e => updateField('customerName', e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <input
                            type="tel"
                            className="form-input"
                            placeholder="(555) 123-4567"
                            value={formData.customerPhone}
                            onChange={e => updateField('customerPhone', e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Address</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="123 Main Street, Brooklyn, NY"
                            value={formData.address}
                            onChange={e => updateField('address', e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Service Type</label>
                        <select
                            className="form-input form-select"
                            value={formData.serviceType}
                            onChange={e => updateField('serviceType', e.target.value as ServiceType)}
                        >
                            {(Object.keys(PRICING) as ServiceType[]).map(service => (
                                <option key={service} value={service}>
                                    {SERVICE_LABELS[service]} - {formatPrice(PRICING[service])}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Price Summary */}
                <div className="card card-glow animate-in animate-delay-2" style={{ marginBottom: 'var(--space-xl)' }}>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-muted">Total Price</p>
                            <p className="mono" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                                {formatPrice(PRICING[formData.serviceType])}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-muted">Upfront • No Hidden Fees</p>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="btn btn-primary btn-large btn-block pulse-glow"
                    disabled={isSubmitting}
                    style={{ marginBottom: 'var(--space-xl)' }}
                >
                    {isSubmitting ? (
                        <>Finding a Buster...</>
                    ) : (
                        <>🚀 Request Snow Buster</>
                    )}
                </button>
            </form>

            {/* Info Card */}
            <div className="ai-card animate-in animate-delay-3">
                <div className="ai-card-title">
                    💡 How it Works
                </div>
                <p className="ai-card-content">
                    1. Submit your request<br />
                    2. A nearby buster accepts your job<br />
                    3. Track progress in real-time<br />
                    4. Rate your experience when done
                </p>
            </div>
        </main>
    )
}
