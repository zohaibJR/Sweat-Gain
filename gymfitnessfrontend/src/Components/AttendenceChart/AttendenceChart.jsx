import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import '../WeightProgressChart/WeightProgressChart.css';
import './AttendenceChart.css';
import { apiUrl } from '../../config/api';

ChartJS.register(ArcElement, Tooltip, Legend);

function AttendenceChart() {
  const [attendance, setAttendance] = useState(null);
  const email = localStorage.getItem('userEmail');

  useEffect(() => {
    if (!email) return;
    const fetch = async () => {
      try {
        const res = await axios.get(apiUrl(`/api/attendance/last10days/pie?email=${email}`));
        setAttendance(res.data);
      } catch (err) { console.error(err); }
    };
    fetch();
  }, [email]);

  const chartData = {
    labels: ['Present', 'Absent'],
    datasets: [{
      data: attendance ? [attendance.presentCount, attendance.absentCount] : [0, 1],
      backgroundColor: ['rgba(0,212,255,0.85)', 'rgba(255,68,68,0.75)'],
      borderColor: ['rgba(0,212,255,0.4)', 'rgba(255,68,68,0.4)'],
      borderWidth: 2,
      hoverBackgroundColor: ['rgba(0,212,255,1)', 'rgba(255,68,68,1)'],
      hoverOffset: 6,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'rgba(255,255,255,0.6)',
          font: { family: 'Rajdhani', size: 13, weight: '600' },
          padding: 20,
          usePointStyle: true,
          pointStyleWidth: 10,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(10,22,40,0.95)',
        borderColor: 'rgba(0,212,255,0.3)',
        borderWidth: 1,
        titleColor: '#00d4ff',
        bodyColor: '#fff',
        titleFont: { family: 'Rajdhani', size: 13, weight: '700' },
        bodyFont: { family: 'Rajdhani', size: 14 },
        padding: 12,
        callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed} days` }
      }
    },
    cutout: '60%',
  };

  const presentRate = attendance && attendance.totalDays > 0
    ? Math.round((attendance.presentCount / attendance.totalDays) * 100)
    : null;

  return (
    <div className="ChartCard">
      <div className="ChartCardHeader">
        <span className="ChartCardTitle">Attendance Split</span>
        <span className="ChartCardBadge">10 Days</span>
      </div>
      <div className="AttChartBody">
        <div className="ChartWrap AttChartWrap">
          {attendance ? (
            <>
              <Pie data={chartData} options={options} />
              {/* Centre donut label */}
              <div className="DonutCenter">
                <span className="DonutRate">{presentRate}%</span>
                <span className="DonutLabel">Present</span>
              </div>
            </>
          ) : (
            <div className="NoData">Loading...</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AttendenceChart;
