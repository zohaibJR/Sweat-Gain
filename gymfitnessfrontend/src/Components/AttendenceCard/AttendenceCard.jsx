import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../DashboardCard.css';
import './AttendenceCard.css';
import { apiUrl } from '../../config/api';

function AttendenceCard() {
  const [status, setStatus] = useState(null);
  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!email) return;
    const fetch = async () => {
      try {
        const res = await axios.get(
          apiUrl(`/api/attendance/check-today?email=${email}`)
        );
        setStatus(res.data.marked ? res.data.status : 'Not Marked');
      } catch {
        setStatus('Error');
      }
    };
    fetch();
  }, [email]);

  const isPresent  = status === 'Present';
  const isAbsent   = status === 'Absent';
  const isUnmarked = status === 'Not Marked' || status === null;

  return (
    <div className={`DashboardCard card-attendance ${isPresent ? 'card-green' : isAbsent ? 'card-red' : ''}`}>
      <div className="CardIcon attendance-icon">🏋️</div>
      <div className="CardLabel">Today's Attendance</div>
      <div className={`CardValue ${isPresent ? 'val-green' : isAbsent ? 'val-red' : 'val-muted'}`}>
        {status === null ? '...' : status}
      </div>
      <div className="CardSub">
        {isPresent ? 'Great job showing up!' : isAbsent ? 'Marked absent today' : 'Not yet marked'}
      </div>
      <div className={`CardBar ${isPresent ? 'bar-green' : isAbsent ? 'bar-red' : ''}`} />
    </div>
  );
}

export default AttendenceCard;
