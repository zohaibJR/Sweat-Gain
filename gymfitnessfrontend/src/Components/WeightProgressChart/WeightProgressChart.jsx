import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './WeightProgressChart.css';
import { apiUrl } from '../../config/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function WeightProgressChart() {
  const [data, setData] = useState([]);
  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!email) return;
    const fetch = async () => {
      try {
        const res = await axios.get(apiUrl(`/api/attendance/last7days?email=${email}`));
        setData(res.data);
      } catch (err) { console.error(err); }
    };
    fetch();
  }, [email]);

  const chartData = {
    labels: data.map(item =>
      new Date(item.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
    ),
    datasets: [{
      label: 'Weight (kg)',
      data: data.map(item => item.weight),
      borderColor: '#00d4ff',
      backgroundColor: (ctx) => {
        const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 220);
        gradient.addColorStop(0, 'rgba(0,212,255,0.25)');
        gradient.addColorStop(1, 'rgba(0,212,255,0.0)');
        return gradient;
      },
      borderWidth: 2.5,
      pointBackgroundColor: '#00d4ff',
      pointBorderColor: '#0a1628',
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7,
      tension: 0.4,
      fill: true,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'WEIGHT PROGRESS — LAST 7 DAYS',
        color: 'rgba(255,255,255,0.5)',
        font: { family: 'Rajdhani', size: 11, weight: '700' },
        letterSpacing: '3px',
        padding: { bottom: 16 }
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
        callbacks: { label: ctx => ` ${ctx.parsed.y} kg` }
      }
    },
    scales: {
      x: {
        ticks: { color: 'rgba(255,255,255,0.4)', font: { family: 'Rajdhani', size: 12 } },
        grid: { color: 'rgba(26,111,212,0.1)' },
        border: { color: 'transparent' }
      },
      y: {
        ticks: { color: 'rgba(255,255,255,0.4)', font: { family: 'Rajdhani', size: 12 }, callback: v => `${v}kg` },
        grid: { color: 'rgba(26,111,212,0.1)' },
        border: { color: 'transparent' }
      }
    }
  };

  return (
    <div className="ChartCard">
      <div className="ChartCardHeader">
        <span className="ChartCardTitle">Weight Trend</span>
        <span className="ChartCardBadge">7 Days</span>
      </div>
      <div className="ChartWrap">
        {data.length === 0 ? (
          <div className="NoData">No data available yet</div>
        ) : (
          <Line data={chartData} options={options} />
        )}
      </div>
    </div>
  );
}

export default WeightProgressChart;
