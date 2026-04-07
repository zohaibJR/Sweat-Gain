import React from 'react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');

  :root {
    --navy: #0a1628;
    --navy-mid: #0f1f3d;
    --navy-light: #162847;
    --blue-accent: #1a6fd4;
    --blue-bright: #2196f3;
    --blue-glow: #4db6ff;
    --cyan: #00d4ff;
    --green: #00e676;
    --white: #ffffff;
    --white-70: rgba(255,255,255,0.7);
    --white-30: rgba(255,255,255,0.3);
    --white-10: rgba(255,255,255,0.08);
  }

  .about-page {
    min-height: 100vh;
    background: var(--navy);
    font-family: 'Rajdhani', sans-serif;
    color: var(--white);
    overflow-x: hidden;
    position: relative;
  }

  /* ── Animated background grid ── */
  .about-page::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(26,111,212,0.07) 1px, transparent 1px),
      linear-gradient(90deg, rgba(26,111,212,0.07) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
    z-index: 0;
  }

  /* ── Glow orbs ── */
  .orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(120px);
    pointer-events: none;
    z-index: 0;
    animation: orbFloat 8s ease-in-out infinite;
  }
  .orb-1 {
    width: 500px; height: 500px;
    background: rgba(26,111,212,0.18);
    top: -100px; left: -100px;
    animation-delay: 0s;
  }
  .orb-2 {
    width: 400px; height: 400px;
    background: rgba(0,212,255,0.10);
    bottom: 100px; right: -80px;
    animation-delay: 3s;
  }
  @keyframes orbFloat {
    0%, 100% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(30px) scale(1.05); }
  }

  /* ── All content above bg ── */
  .about-content {
    position: relative;
    z-index: 1;
    max-width: 1100px;
    margin: 0 auto;
    padding: 60px 30px 80px;
  }

  /* ── Hero ── */
  .hero-section {
    text-align: center;
    padding: 20px 0 60px;
    animation: fadeUp 0.7s ease both;
  }
  .hero-badge {
    display: inline-block;
    background: linear-gradient(135deg, rgba(26,111,212,0.3), rgba(0,212,255,0.15));
    border: 1px solid rgba(0,212,255,0.4);
    color: var(--cyan);
    font-family: 'Rajdhani', sans-serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 4px;
    text-transform: uppercase;
    padding: 8px 24px;
    border-radius: 40px;
    margin-bottom: 28px;
  }
  .hero-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(64px, 10vw, 110px);
    line-height: 0.9;
    letter-spacing: 4px;
    color: var(--white);
    margin: 0 0 10px;
    text-shadow: 0 0 80px rgba(33,150,243,0.4);
  }
  .hero-title span {
    color: transparent;
    -webkit-text-stroke: 2px var(--blue-bright);
    display: block;
  }
  .hero-subtitle {
    font-family: 'Inter', sans-serif;
    font-size: 17px;
    font-weight: 300;
    color: var(--white-70);
    max-width: 500px;
    margin: 24px auto 0;
    line-height: 1.7;
    letter-spacing: 0.3px;
  }

  /* ── Divider line ── */
  .divider {
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, var(--blue-accent), var(--cyan));
    margin: 24px auto;
    border-radius: 2px;
  }

  /* ── Mission card ── */
  .mission-card {
    background: linear-gradient(135deg, rgba(26,111,212,0.15), rgba(0,212,255,0.06));
    border: 1px solid rgba(26,111,212,0.35);
    border-radius: 20px;
    padding: 48px 52px;
    text-align: center;
    margin-bottom: 60px;
    position: relative;
    overflow: hidden;
    animation: fadeUp 0.7s 0.15s ease both;
  }
  .mission-card::before {
    content: '"';
    position: absolute;
    top: -20px;
    left: 30px;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 180px;
    color: rgba(33,150,243,0.08);
    line-height: 1;
    pointer-events: none;
  }
  .mission-label {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 5px;
    color: var(--cyan);
    text-transform: uppercase;
    margin-bottom: 20px;
  }
  .mission-text {
    font-family: 'Rajdhani', sans-serif;
    font-size: 22px;
    font-weight: 500;
    color: var(--white);
    line-height: 1.65;
    max-width: 700px;
    margin: 0 auto;
  }

  /* ── Stats row ── */
  .stats-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 60px;
    animation: fadeUp 0.7s 0.25s ease both;
  }
  .stat-card {
    background: var(--white-10);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 16px;
    padding: 32px 20px;
    text-align: center;
    transition: border-color 0.3s, transform 0.3s;
  }
  .stat-card:hover {
    border-color: var(--blue-bright);
    transform: translateY(-4px);
  }
  .stat-number {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 54px;
    line-height: 1;
    background: linear-gradient(135deg, var(--blue-bright), var(--cyan));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 6px;
  }
  .stat-label {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 2px;
    color: var(--white-70);
    text-transform: uppercase;
  }

  /* ── Features grid ── */
  .section-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 42px;
    letter-spacing: 3px;
    color: var(--white);
    text-align: center;
    margin-bottom: 8px;
  }
  .section-sub {
    text-align: center;
    color: var(--white-70);
    font-size: 15px;
    font-family: 'Inter', sans-serif;
    font-weight: 300;
    margin-bottom: 36px;
  }
  .features-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-bottom: 60px;
    animation: fadeUp 0.7s 0.35s ease both;
  }
  .feature-card {
    background: var(--white-10);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 16px;
    padding: 32px 28px;
    display: flex;
    gap: 20px;
    align-items: flex-start;
    transition: border-color 0.3s, background 0.3s, transform 0.3s;
    cursor: default;
  }
  .feature-card:hover {
    border-color: rgba(33,150,243,0.5);
    background: rgba(33,150,243,0.08);
    transform: translateY(-3px);
  }
  .feature-icon {
    width: 52px;
    height: 52px;
    min-width: 52px;
    border-radius: 14px;
    background: linear-gradient(135deg, rgba(26,111,212,0.4), rgba(0,212,255,0.2));
    border: 1px solid rgba(0,212,255,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
  }
  .feature-title {
    font-family: 'Rajdhani', sans-serif;
    font-size: 19px;
    font-weight: 700;
    color: var(--white);
    margin-bottom: 6px;
    letter-spacing: 0.5px;
  }
  .feature-desc {
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 300;
    color: var(--white-70);
    line-height: 1.65;
  }

  /* ── Team section ── */
  .team-section {
    animation: fadeUp 0.7s 0.45s ease both;
    margin-bottom: 60px;
  }
  .team-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-top: 36px;
  }
  .team-card {
    background: var(--white-10);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 16px;
    padding: 32px 20px;
    text-align: center;
    transition: border-color 0.3s, transform 0.3s;
  }
  .team-card:hover {
    border-color: var(--blue-bright);
    transform: translateY(-4px);
  }
  .team-avatar {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--blue-accent), var(--cyan));
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 28px;
    color: var(--white);
    margin: 0 auto 16px;
    border: 2px solid rgba(0,212,255,0.4);
  }
  .team-name {
    font-family: 'Rajdhani', sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: var(--white);
    margin-bottom: 4px;
  }
  .team-role {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 2px;
    color: var(--cyan);
    text-transform: uppercase;
  }

  /* ── Bottom CTA ── */
  .cta-section {
    background: linear-gradient(135deg, rgba(26,111,212,0.2), rgba(0,212,255,0.08));
    border: 1px solid rgba(26,111,212,0.4);
    border-radius: 20px;
    padding: 52px;
    text-align: center;
    animation: fadeUp 0.7s 0.55s ease both;
    position: relative;
    overflow: hidden;
  }
  .cta-section::after {
    content: '💪';
    position: absolute;
    right: 40px;
    bottom: -10px;
    font-size: 120px;
    opacity: 0.07;
    pointer-events: none;
  }
  .cta-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 48px;
    letter-spacing: 3px;
    margin-bottom: 12px;
    color: var(--white);
  }
  .cta-text {
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    font-weight: 300;
    color: var(--white-70);
    max-width: 480px;
    margin: 0 auto 32px;
    line-height: 1.7;
  }
  .cta-btn {
    display: inline-block;
    background: linear-gradient(135deg, var(--blue-accent), var(--blue-bright));
    color: var(--white);
    font-family: 'Rajdhani', sans-serif;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 14px 44px;
    border-radius: 50px;
    border: none;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 24px rgba(33,150,243,0.4);
    text-decoration: none;
  }
  .cta-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(33,150,243,0.6);
  }

  /* ── Animations ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .stats-row { grid-template-columns: repeat(2, 1fr); }
    .features-grid { grid-template-columns: 1fr; }
    .team-grid { grid-template-columns: 1fr; }
    .mission-card { padding: 36px 28px; }
    .cta-section { padding: 36px 24px; }
    .cta-section::after { display: none; }
  }
  @media (max-width: 480px) {
    .stats-row { grid-template-columns: 1fr; }
    .hero-title { font-size: 64px; }
  }
`;

const features = [
  {
    icon: '📊',
    title: 'Smart Attendance Tracking',
    desc: 'Log your gym visits daily. Miss a day? The system auto-marks Absent and carries your last weight forward — so your record is always accurate.',
  },
  {
    icon: '⚖️',
    title: 'Weight Progress Monitoring',
    desc: 'Track your weight journey from day one. Visual charts show your trend over the last 7 days so you can see real progress, not guesswork.',
  },
  {
    icon: '🗓️',
    title: 'Monthly Insights',
    desc: 'See how many days you showed up this month at a glance. Monthly attendance cards keep you honest and motivated.',
  },
  {
    icon: '🤖',
    title: 'Auto Rest Day Logic',
    desc: 'Sundays are automatically marked Present — because rest is part of the grind. No manual input needed on your recovery day.',
  },
  {
    icon: '🔥',
    title: 'Streak Tracking',
    desc: 'Build your consecutive attendance streak. Watching that number grow is one of the most powerful motivators you can have.',
  },
  {
    icon: '📈',
    title: 'Visual Dashboard',
    desc: 'Everything in one place — pie charts, line graphs, summary cards, and latest records. Your fitness story told in data.',
  },
];

const team = [
  { initials: 'Zohaib', name: 'Zohaib ur Rehman', role: 'Founder & Developer' },
  { initials: 'S & G', name: 'Sweat & Gain', role: 'The Vision' },
  { initials: '💪', name: 'You', role: 'The Athlete' },
];

function Aboutus() {
  return (
    <div className="about-page">
      <style>{styles}</style>

      {/* Background effects */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div className="about-content">

        {/* ── Hero ── */}
        <section className="hero-section">
          <div className="hero-badge">Est. 2024 · Built for Athletes</div>
          <h1 className="hero-title">
            Sweat
            <span>&amp; Gain</span>
          </h1>
          <div className="divider" />
          <p className="hero-subtitle">
            A gym attendance and weight tracker built by athletes, for athletes.
            No fluff — just your data, your progress, your grind.
          </p>
        </section>

        {/* ── Mission ── */}
        <div className="mission-card">
          <div className="mission-label">Our Mission</div>
          <p className="mission-text">
            We believe consistency is the only cheat code in fitness.
            SweatAndGain exists to make tracking effortless so you can
            focus on what matters — showing up, lifting heavy, and watching
            your numbers change over time.
          </p>
        </div>

        {/* ── Stats ── */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-number">100%</div>
            <div className="stat-label">Free to Use</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Auto Tracking</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">∞</div>
            <div className="stat-label">Days Logged</div>
          </div>
        </div>

        {/* ── Features ── */}
        <div style={{ marginBottom: '60px' }}>
          <h2 className="section-title">What We Offer</h2>
          <p className="section-sub">Everything you need to stay accountable — nothing you don't.</p>
          <div className="features-grid">
            {features.map((f, i) => (
              <div className="feature-card" key={i}>
                <div className="feature-icon">{f.icon}</div>
                <div>
                  <div className="feature-title">{f.title}</div>
                  <div className="feature-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Team ── */}
        <div className="team-section">
          <h2 className="section-title">Behind the App</h2>
          <p className="section-sub">Small team. Big vision.</p>
          <div className="team-grid">
            {team.map((t, i) => (
              <div className="team-card" key={i}>
                <div className="team-avatar">{t.initials}</div>
                <div className="team-name">{t.name}</div>
                <div className="team-role">{t.role}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="cta-section">
          <div className="cta-title">Ready to Start?</div>
          <p className="cta-text">
            Every rep counts. Every day logged matters.
            Start tracking today and see where consistency takes you.
          </p>
          <a href="/attendence" className="cta-btn">Mark Today's Attendance</a>
        </div>

      </div>
    </div>
  );
}

export default Aboutus;