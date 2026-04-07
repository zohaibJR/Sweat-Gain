import React from "react";
import SummaryCards from "../Components/SummaryCards/SummaryCards";
import WeightProgress from "../Components/WeightProgress/WeightProgress";
import QuickView from "../Components/QuickView/QuickView";
import Quote from "../Components/Quote/Quote";
import './Style/Dashboard.css';

function DashBoard() {
  const email = localStorage.getItem('userEmail') || '';
  const name  = email.split('@')[0] || 'Athlete';

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });

  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="MainDashboard">

      {/* ── Greeting Header ── */}
      <div className="DashGreeting">
        <div className="DashGreeting-left">
          <h1>{greeting}, <span>{name}</span> 💪</h1>
          <p>Here's your fitness overview</p>
        </div>
        <div className="DashDate">{dateStr}</div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="anim-1" style={{ width: '100%', maxWidth: '1200px' }}>
        <div className="SectionLabel">Today's Stats</div>
        <SummaryCards />
      </div>

      {/* ── Charts ── */}
      <div className="anim-2" style={{ width: '100%', maxWidth: '1200px', marginTop: '8px' }}>
        <div className="SectionLabel">Progress Charts</div>
        <WeightProgress />
      </div>

      {/* ── Quick View ── */}
      <div className="anim-3" style={{ width: '100%', maxWidth: '1200px', marginTop: '8px' }}>
        <div className="SectionLabel">Quick View</div>
        <QuickView />
      </div>

      {/* ── Quote ── */}
      <div className="anim-4" style={{ width: '100%', maxWidth: '1200px', marginTop: '8px' }}>
        <Quote />
      </div>

    </div>
  );
}

export default DashBoard;