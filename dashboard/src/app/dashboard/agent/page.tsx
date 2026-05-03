'use client';

import React, { useState } from 'react';
import styles from '../dashboard.module.css';

export default function AgentPersonaPage() {
  const [formData, setFormData] = useState({
    agentName: 'Aria',
    voice: 'kavya',
    firstLine: 'Hello! Thanks for calling Trinity Pixels. How can I help you today?',
    instructions: 'You are Aria, a friendly and professional AI receptionist for Trinity Pixels. Your goal is to help callers with service inquiries, book appointments, or transfer them to a human agent if needed.',
    maxTurns: 30,
    transferNumber: '+917710884479'
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // In a real app: await api.patch('/tenants/config', formData);
    setTimeout(() => {
      setIsSaving(false);
      alert('Persona updated successfully!');
    }, 1000);
  };

  return (
    <div className="animate-fade">
      <div className={styles.sectionGrid} style={{ gridTemplateColumns: '1fr' }}>
        <div className={`${styles.card} glass`}>
          <h2>Agent Persona Settings</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Configure how your AI receptionist sounds and behaves.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
            <div className="input-group">
              <label>Agent Name</label>
              <input type="text" name="agentName" value={formData.agentName} onChange={handleChange} />
            </div>
            
            <div className="input-group">
              <label>Voice (TTS)</label>
              <select name="voice" value={formData.voice} onChange={handleChange}>
                <option value="kavya">Kavya (Indian English - Female)</option>
                <option value="ravina">Ravina (Hindi - Female)</option>
                <option value="arjun">Arjun (Indian English - Male)</option>
              </select>
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: '2rem' }}>
            <label>First Line (Greeting)</label>
            <input type="text" name="firstLine" value={formData.firstLine} onChange={handleChange} />
          </div>

          <div className="input-group" style={{ marginBottom: '2rem' }}>
            <label>System Instructions (LLM Prompt)</label>
            <textarea 
              name="instructions" 
              value={formData.instructions} 
              onChange={handleChange}
              rows={6}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
             <div className="input-group">
              <label>Fallback Transfer Number</label>
              <input type="text" name="transferNumber" value={formData.transferNumber} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>Max Conversation Turns</label>
              <input type="number" name="maxTurns" value={formData.maxTurns} onChange={handleChange} />
            </div>
          </div>

          <button className="btn-primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
