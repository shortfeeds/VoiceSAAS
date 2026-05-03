'use client';

import React, { useEffect, useState } from 'react';
import styles from './dashboard.module.css';
import { TrendingUp, Users, Clock, Calendar } from 'lucide-react';
import api from '@/lib/api';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalCalls: 128,
    minutesUsed: 432,
    activeAgents: 1,
    bookings: 12
  });

  const [calls, setCalls] = useState([
    { id: '1', number: '+91 98XXX XXXX', duration: '2m 14s', status: 'Completed', time: '10 mins ago' },
    { id: '2', number: '+91 77XXX XXXX', duration: '4m 30s', status: 'Booked', time: '1 hour ago' },
    { id: '3', number: '+91 80XXX XXXX', duration: '1m 05s', status: 'Completed', time: '2 hours ago' },
  ]);

  useEffect(() => {
    // Fetch real stats and calls from backend
    const fetchData = async () => {
      try {
        const [statsRes, callsRes] = await Promise.all([
          api.get('/usage/current').catch(() => ({ data: stats })),
          api.get('/calls').catch(() => ({ data: calls }))
        ]);
        if (statsRes.data) {
          setStats({
            totalCalls: statsRes.data.totalCalls || 0,
            minutesUsed: Math.round(statsRes.data.minutesUsed || 0),
            activeAgents: 1, // Mocked for now until agent stats endpoint is built
            bookings: statsRes.data.bookings || 0
          });
        }
        if (callsRes.data && Array.isArray(callsRes.data)) {
          setCalls(callsRes.data.map((c: any) => ({
            id: c.id,
            number: c.callerNumber || 'Unknown',
            duration: `${Math.round(c.duration / 60)}m ${c.duration % 60}s`,
            status: c.status,
            time: new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          })));
        }
      } catch (err) {
        console.warn('Backend currently unreachable, using mock data');
      }
    };
    fetchData();
  }, []);

  return (
    <div className="animate-fade">
      {/* Stats Overview */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} glass`}>
          <span className={styles.statCardLabel}>Total Calls</span>
          <div className={styles.statCardValue}>{stats.totalCalls}</div>
          <span className={styles.statCardTrend}>+12% this month</span>
        </div>
        <div className={`${styles.statCard} glass`}>
          <span className={styles.statCardLabel}>Minutes Used</span>
          <div className={styles.statCardValue}>{stats.minutesUsed}</div>
          <span className={styles.statCardTrend}>43.2% of plan</span>
        </div>
        <div className={`${styles.statCard} glass`}>
          <span className={styles.statCardLabel}>Active Agents</span>
          <div className={styles.statCardValue}>{stats.activeAgents}</div>
          <span className={styles.statCardTrend}>Pro Tier</span>
        </div>
        <div className={`${styles.statCard} glass`}>
          <span className={styles.statCardLabel}>Bookings</span>
          <div className={styles.statCardValue}>{stats.bookings}</div>
          <span className={styles.statCardTrend}>+5 this week</span>
        </div>
      </div>

      {/* Main Sections */}
      <div className={styles.sectionGrid}>
        <div className={`${styles.card} glass`}>
          <h2>Recent Call Logs</h2>
          <table className={styles.callLogTable}>
            <thead>
              <tr>
                <th>Caller Number</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {calls.map(call => (
                <tr key={call.id}>
                  <td>{call.number}</td>
                  <td>{call.duration}</td>
                  <td><span className={styles.statusPill}>{call.status}</span></td>
                  <td>{call.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={`${styles.card} glass`}>
          <h2>Quick Actions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button className="btn-primary" style={{ width: '100%' }}>Download Monthly Report</button>
            <button className={styles.btnSecondary} style={{ width: '100%' }}>Update Agent Persona</button>
            <button className={styles.btnSecondary} style={{ width: '100%', borderColor: '#f87171', color: '#f87171' }}>Stop All Agents</button>
          </div>
          
          <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Pro Tip</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Enable "Aria" on your main business line to reduce missed appointments by up to 40%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
