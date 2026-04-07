import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../DashboardCard.css';
import './CurrentWeight.css';
import { apiUrl } from '../../config/api';

function CurrentWeight() {
  const [weight, setWeight] = useState(null);
  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!email) return;
    const fetch = async () => {
      try {
        const res = await axios.get(apiUrl(`/api/attendance/latest?email=${email}`));
        setWeight(res.data.weight);
      } catch (err) { console.error(err); }
    };
    fetch();
  }, [email]);

  return (
    <div className="DashboardCard card-weight">
      <div className="CardIcon weight-icon">⚖️</div>
      <div className="CardLabel">Current Weight</div>
      <div className="CardValue val-gold">
        {weight !== null ? weight : '...'}
        {weight !== null && <span className="CardUnit"> kg</span>}
      </div>
      <div className="CardSub">Last recorded weight</div>
      <div className="CardBar bar-gold" />
    </div>
  );
}

export default CurrentWeight;
