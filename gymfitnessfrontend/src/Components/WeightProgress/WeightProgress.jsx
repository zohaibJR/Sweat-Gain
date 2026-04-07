import React from 'react';
import './WeightProgress.css';
import WeightProgressChart from '../WeightProgressChart/WeightProgressChart';
import AttendenceChart from '../AttendenceChart/AttendenceChart';

function WeightProgress() {
  return (
    <div className="WeightProgress">
      <WeightProgressChart />
      <AttendenceChart />
    </div>
  );
}

export default WeightProgress;