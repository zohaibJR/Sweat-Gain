import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../DashboardCard.css';
import './MonthlyAttendence.css';
import { apiUrl } from '../../config/api';

function MonthlyAttendence() {
  const [attendance, setAttendance] = useState(null);
  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!email) return;
    const fetch = async () => {
      try {
        const res = await axios.get(apiUrl(`/api/attendance/monthly?email=${email}`));
        setAttendance(res.data);
      } catch (err) { console.error(err); }
    };
    fetch();
  }, [email]);

  const rate = attendance
    ? Math.round((attendance.presentCount / attendance.totalDays) * 100)
    : null;

  return (
    <div className="DashboardCard card-monthly">
      <div className="CardIcon monthly-icon">📅</div>
      <div className="CardLabel">Monthly Attendance</div>
      <div className="CardValue val-cyan">
        {attendance ? `${attendance.presentCount}/${attendance.totalDays}` : '...'}
      </div>
      <div className="MonthlyBarWrap">
        <div className="MonthlyBarTrack">
          <div className="MonthlyBarFill" style={{ width: rate ? `${rate}%` : '0%' }} />
        </div>
        <span className="MonthlyRate">{rate !== null ? `${rate}%` : ''}</span>
      </div>
      <div className="CardSub">{attendance ? attendance.month : 'Loading...'}</div>
      <div className="CardBar bar-cyan" />
    </div>
  );
}

export default MonthlyAttendence;
