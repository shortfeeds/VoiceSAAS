import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className="grid-bg" />
      <div className="hero-glow" />
      
      <nav className={`${styles.nav} glass animate-fade`}>
        <div className={styles.logo}>TRINITY PIXELS</div>
        <div className={styles.navLinks}>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <button className="btn-primary">Get Started</button>
        </div>
      </nav>

      <section className={styles.hero}>
        <h1 className={`${styles.title} animate-fade`}>
          Your Front Desk, <br />
          <span className="gradient-text">Powered by AI.</span>
        </h1>
        <p className={`${styles.subtitle} animate-fade`}>
          Experience the world's most advanced multi-tenant AI voice receptionist platform. 
          Human-like conversations, 24/7 availability, zero latency.
        </p>
        <div className={`${styles.cta} animate-fade`}>
          <button className="btn-primary">Start Free Trial</button>
          <button className={styles.btnSecondary}>Watch Demo</button>
        </div>
      </section>

      <section className={styles.dashboardPreview}>
        <div className="glass animate-fade">
          <div className={styles.mockDashboard}>
            <div className={styles.sidebar}>
              <div className={styles.active}>Overview</div>
              <div>Call Logs</div>
              <div>Agent Persona</div>
              <div>Billing</div>
            </div>
            <div className={styles.content}>
              <h3>Active Agents</h3>
              <div className={styles.stats}>
                <div className="glass">
                  <span className={styles.statLabel}>Total Calls</span>
                  <span className={styles.statValue}>1,284</span>
                </div>
                <div className="glass">
                  <span className={styles.statLabel}>Minutes Used</span>
                  <span className={styles.statValue}>4,102</span>
                </div>
                <div className="glass">
                  <span className={styles.statLabel}>Bookings</span>
                  <span className={styles.statValue}>342</span>
                </div>
              </div>
              <div className={styles.recentCalls}>
                <h4>Recent Call Logs</h4>
                <div className={styles.callRow}>
                  <span>+91 98XXX XXXX</span>
                  <span>Completed</span>
                  <span>2m 45s</span>
                </div>
                <div className={styles.callRow}>
                  <span>+91 77XXX XXXX</span>
                  <span>Booked</span>
                  <span>4m 12s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
