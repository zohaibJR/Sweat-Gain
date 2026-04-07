import React from 'react';
import './QuickView.css';
import LatestRecords from '../LatestRecords/LatestRecords';
import QuickActions from '../QuickActions/QuickActions';
import WeeklySummary from '../WeeklySummary/WeeklySummary';

function QuickView() {
  return (
    <div className='QuickView'>
      <LatestRecords />
      <div className="QuickViewRight">
        <QuickActions />
        <WeeklySummary />
      </div>
    </div>
  );
}

export default QuickView;