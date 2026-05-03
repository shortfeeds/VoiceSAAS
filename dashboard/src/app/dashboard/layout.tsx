import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, PhoneCall, Settings, LogOut, BarChart3, User } from 'lucide-react';
import styles from './dashboard.module.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.dashboardContainer}>
      <div className="grid-bg" />
      
      {/* Sidebar */}
      <aside className={`${styles.sidebar} glass`}>
        <div className={styles.logo}>TRINITY PIXELS</div>
        
        <nav className={styles.nav}>
          <Link href="/dashboard" className={styles.navItem}>
            <LayoutDashboard size={20} />
            <span>Overview</span>
          </Link>
          <Link href="/dashboard/calls" className={styles.navItem}>
            <PhoneCall size={20} />
            <span>Call Logs</span>
          </Link>
          <Link href="/dashboard/stats" className={styles.navItem}>
            <BarChart3 size={20} />
            <span>Usage</span>
          </Link>
          <Link href="/dashboard/agent" className={styles.navItem}>
            <Settings size={20} />
            <span>Agent Persona</span>
          </Link>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.navItem}>
            <User size={20} />
            <span>Profile</span>
          </div>
          <div className={`${styles.navItem} ${styles.logout}`}>
            <LogOut size={20} />
            <span>Sign Out</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.headerTitle}>
            <h1>Welcome back, Aria</h1>
            <p>Here's what happened with your AI Receptionist today.</p>
          </div>
          <div className={styles.headerActions}>
            <button className="btn-primary">Connect Plivo</button>
          </div>
        </header>

        <div className={styles.scrollArea}>
          {children}
        </div>
      </main>
    </div>
  );
}
