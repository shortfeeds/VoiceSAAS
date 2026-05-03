'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './onboarding.module.css';
import api from '@/lib/api';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    phone: '',
    agentName: 'Aria',
    voice: 'kavya',
    greeting: 'Hello! Thanks for calling. How can I help you today?',
    planId: 'pro',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => setStep((s) => Math.min(s + 1, 4));
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleLaunch = async () => {
    setIsSubmitting(true);
    try {
      // In a real app, this would register the tenant, create the agent config,
      // and trigger the ProvisioningController to buy a Plivo number.
      // await api.post('/tenants/register', formData);
      // await api.post('/provisioning/provision', { clientId: newTenantId, region: 'IN' });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Launch failed:', error);
      alert('Failed to provision your agent. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.onboardingContainer}>
      <div className={`${styles.onboardingCard} glass animate-fade`}>
        {/* Progress Bar */}
        <div className={styles.progressHeader}>
          <div className={styles.stepIndicator}>
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`${styles.stepDot} ${step >= s ? styles.activeDot : ''}`} />
            ))}
          </div>
          <span className={styles.stepText}>Step {step} of 4</span>
        </div>

        {/* Step 1: Business Info */}
        {step === 1 && (
          <div className="animate-fade">
            <h2>Welcome to Trinity Pixels</h2>
            <p className={styles.subtitle}>Let's set up your AI Receptionist. First, tell us about your business.</p>
            
            <div className="input-group" style={{ marginBottom: '1.5rem' }}>
              <label>Business Name</label>
              <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} placeholder="e.g. Acme Corp" />
            </div>
            <div className="input-group" style={{ marginBottom: '1.5rem' }}>
              <label>Admin Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="admin@acme.com" />
            </div>
            <div className="input-group" style={{ marginBottom: '2rem' }}>
              <label>Contact Phone</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" />
            </div>
          </div>
        )}

        {/* Step 2: Agent Setup */}
        {step === 2 && (
          <div className="animate-fade">
            <h2>Design Your Agent</h2>
            <p className={styles.subtitle}>Configure how your AI sounds and greets callers.</p>
            
            <div className="input-group" style={{ marginBottom: '1.5rem' }}>
              <label>Agent Name</label>
              <input type="text" name="agentName" value={formData.agentName} onChange={handleChange} />
            </div>
            <div className="input-group" style={{ marginBottom: '1.5rem' }}>
              <label>Voice Provider</label>
              <select name="voice" value={formData.voice} onChange={handleChange}>
                <option value="kavya">Kavya (Indian Female)</option>
                <option value="arjun">Arjun (Indian Male)</option>
                <option value="ravina">Ravina (Hindi Female)</option>
              </select>
            </div>
            <div className="input-group" style={{ marginBottom: '2rem' }}>
              <label>First Greeting</label>
              <textarea name="greeting" value={formData.greeting} onChange={handleChange} rows={3} />
            </div>
          </div>
        )}

        {/* Step 3: Plan Selection */}
        {step === 3 && (
          <div className="animate-fade">
            <h2>Select a Plan</h2>
            <p className={styles.subtitle}>Choose the subscription that fits your call volume.</p>
            
            <div className={styles.planGrid}>
              {['starter', 'pro', 'unlimited'].map((plan) => (
                <div 
                  key={plan} 
                  className={`${styles.planCard} ${formData.planId === plan ? styles.selectedPlan : ''}`}
                  onClick={() => setFormData({ ...formData, planId: plan })}
                >
                  <h3 style={{ textTransform: 'capitalize' }}>{plan}</h3>
                  <div className={styles.planPrice}>
                    {plan === 'starter' ? '₹4,999' : plan === 'pro' ? '₹9,999' : '₹19,999'}<span>/mo</span>
                  </div>
                  <ul className={styles.planFeatures}>
                    <li>{plan === 'starter' ? '500' : plan === 'pro' ? '1000' : 'Unlimited'} Minutes</li>
                    <li>Basic Support</li>
                    {plan !== 'starter' && <li>Custom Knowledge Base</li>}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Launch */}
        {step === 4 && (
          <div className="animate-fade">
            <h2>Ready to Launch! 🚀</h2>
            <p className={styles.subtitle}>Review your settings. When you click Launch, we will automatically provision a local Indian phone number for your AI.</p>
            
            <div className={styles.summaryBox}>
              <div className={styles.summaryItem}><span>Business:</span> {formData.businessName || 'Not provided'}</div>
              <div className={styles.summaryItem}><span>Agent:</span> {formData.agentName} ({formData.voice})</div>
              <div className={styles.summaryItem}><span>Plan:</span> {formData.planId.toUpperCase()}</div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className={styles.buttonGroup}>
          {step > 1 ? (
            <button className="btn-secondary" onClick={handleBack} disabled={isSubmitting}>Back</button>
          ) : <div></div>}
          
          {step < 4 ? (
            <button className="btn-primary" onClick={handleNext}>Continue</button>
          ) : (
            <button className="btn-primary" onClick={handleLaunch} disabled={isSubmitting}>
              {isSubmitting ? 'Provisioning Number...' : 'Launch Receptionist'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
