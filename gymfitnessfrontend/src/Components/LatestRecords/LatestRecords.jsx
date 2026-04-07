import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './LatestRecords.css';
import { apiUrl } from '../../config/api';

function LatestRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const email = localStorage.getItem('userEmail');
        if (!email) { setLoading(false); return; }

        const [attRes, weightRes] = await Promise.all([
          axios.get(apiUrl(`/api/attendance/last7days/attendance-records?email=${email}`)),
          axios.get(apiUrl(`/api/attendance/last7days/weight-records?email=${email}`))
        ]);

        const combined = attRes.data.map(att => {
          const weightObj = weightRes.data.find(w => w.date === att.date);
          return { date: att.date, status: att.status, weight: weightObj?.weight ?? null };
        });

        setRecords(combined);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching records:', error);
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  return (
    <div className="LatestRecords">
      <div className="LRHeader">
        <span className="LRTitle">Latest Records</span>
        <span className="LRBadge">7 Days</span>
      </div>

      <div className="LRTableHead">
        <span>Date</span>
        <span>Weight</span>
        <span>Status</span>
      </div>

      <div className="LRBody">
        {loading ? (
          <div className="LREmpty">Loading...</div>
        ) : records.length === 0 ? (
          <div className="LREmpty">No records found</div>
        ) : (
          records.map(record => (
            <div className="LRRow" key={record.date}>
              <span className="LRDate">{record.date}</span>
              <span className="LRWeight">
                {record.weight !== null ? `${record.weight} kg` : '—'}
              </span>
              <span className={`LRStatus ${record.status === 'Present' ? 'lrs-present' : 'lrs-absent'}`}>
                {record.status === 'Present' ? '✅ Present' : '❌ Absent'}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default LatestRecords;
