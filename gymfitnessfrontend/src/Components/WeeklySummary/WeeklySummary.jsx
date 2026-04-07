import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './WeeklySummary.css';
import { apiUrl } from '../../config/api';

function WeeklySummary() {
  const [streak,          setStreak]          = useState(null);
  const [monthlyAvg,      setMonthlyAvg]      = useState(null);
  const [weightChange,    setWeightChange]     = useState(null);
  const [weightChangeRaw, setWeightChangeRaw] = useState(null);
  const email = localStorage.getItem('userEmail');

  useEffect(() => {
    if (!email) return;
    const fetchData = async () => {
      try {
        const [monthlyRes, weightRes, attRes] = await Promise.all([
          axios.get(apiUrl(`/api/attendance/monthly?email=${email}`)),
          axios.get(apiUrl(`/api/attendance/weight-change?email=${email}`)),
          axios.get(apiUrl(`/api/attendance/last7days/attendance-records?email=${email}`))
        ]);

        const { presentCount, totalDays } = monthlyRes.data;
        const avg = totalDays > 0 ? ((presentCount / totalDays) * 100).toFixed(0) : 0;
        setMonthlyAvg(`${avg}%`);

        const { change } = weightRes.data;
        setWeightChangeRaw(change ?? 0);
        const sign = change > 0 ? '+' : '';
        setWeightChange(`${sign}${(change ?? 0).toFixed(1)} kg`);

        const records = [...attRes.data].reverse();
        let s = 0;
        for (let i = records.length - 1; i >= 0; i--) {
          if (records[i].status === 'Present') s++;
          else break;
        }
        setStreak(s);
      } catch (err) {
        console.error('WeeklySummary fetch error:', err);
      }
    };
    fetchData();
  }, [email]);

  const weightColor = weightChangeRaw === null ? 'var(--white)'
    : weightChangeRaw < 0 ? 'var(--green)'
    : weightChangeRaw > 0 ? 'var(--red)'
    : 'var(--white-70)';

  const stats = [
    { icon: '🔥', label: 'Current Streak', value: streak === null ? '...' : `${streak} day${streak !== 1 ? 's' : ''}`, color: '#ff9800' },
    { icon: '📅', label: 'Monthly Avg Attendence',    value: monthlyAvg ?? '...',    color: 'var(--cyan)' },
    { icon: '⚖️', label: 'Weight Change Since Started',  value: weightChange ?? '...',  color: weightColor },
  ];

  return (
    <div className='WeeklySummary'>
      <span className="WSTitle">Monthly Summary</span>
      <div className="WSStats">
        {stats.map((s, i) => (
          <div className="WSStat" key={i}>
            <span className="WSStatIcon">{s.icon}</span>
            <div className="WSStatRight">
              <span className="WSStatLabel">{s.label}</span>
              <span className="WSStatValue" style={{ color: s.color }}>{s.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeeklySummary;
