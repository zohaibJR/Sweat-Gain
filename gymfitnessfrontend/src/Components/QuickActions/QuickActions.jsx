import React from 'react';
import { useNavigate } from 'react-router-dom';
import './QuickActions.css';

function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className='QuickActions'>
      <span className="QATitle">Quick Actions</span>

      <button className="QABtn QABtn-primary" onClick={() => navigate('/attendence')}>
        <span className="QABtnIcon">🏋️</span>
        Mark Attendance
      </button>

      <button className="QABtn QABtn-secondary" onClick={() => navigate('/records')}>
        <span className="QABtnIcon">📋</span>
        View Records
      </button>
    </div>
  );
}

export default QuickActions;