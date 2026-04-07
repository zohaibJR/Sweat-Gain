import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../DashboardCard.css';
import './WeightChange.css';
import { apiUrl } from '../../config/api';

function WeightChange() {
  const [data, setData] = useState(null);
  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!email) return;
    const fetch = async () => {
      try {
        const res = await axios.get(apiUrl(`/api/attendance/weight-change?email=${email}`));
        setData(res.data);
      } catch (err) { console.error(err); }
    };
    fetch();
  }, [email]);

  const change = data?.change ?? 0;
  const isLoss = change < 0;
  const isGain = change > 0;

  return (
    <div className={`DashboardCard card-change ${isLoss ? 'card-loss' : isGain ? 'card-gain' : ''}`}>
      <div className="CardIcon change-icon">
        {isLoss ? '📉' : isGain ? '📈' : '➡️'}
      </div>
      <div className="CardLabel">Weight Change</div>
      <div className={`CardValue ${isLoss ? 'val-green' : isGain ? 'val-red' : 'val-muted'}`}>
        {data === null ? '...' : `${isGain ? '+' : ''}${change.toFixed(1)}`}
        {data !== null && <span className="CardUnit"> kg</span>}
      </div>
      <div className="CardSub">
        {data ? `${data.firstWeight} → ${data.latestWeight} kg` : 'Since first record'}
      </div>
      <div className={`CardBar ${isLoss ? 'bar-green' : isGain ? 'bar-red' : ''}`} />
    </div>
  );
}

export default WeightChange;
