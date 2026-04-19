import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { apiUrl } from '../../config/api';
import { syncStoredProStatus } from '../../utils/proStatus';

/* ─────────────────────────────────── CSS ─────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');

.FPage { min-height:100vh; background:#0a1628; position:relative; display:flex; align-items:center; justify-content:center; padding:40px 20px; overflow-x:hidden; }
.FPage::before { content:''; position:fixed; inset:0; pointer-events:none; z-index:0;
  background-image:linear-gradient(rgba(26,111,212,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(26,111,212,.07) 1px,transparent 1px);
  background-size:60px 60px; }

.FCard { position:relative; z-index:1; width:100%; max-width:520px; background:rgba(15,31,61,.84); backdrop-filter:blur(14px); border:1px solid rgba(26,111,212,.28); border-radius:24px; padding:40px 36px; animation:fadeUp .6s ease both; }

/* Header */
.FHdr  { text-align:center; margin-bottom:32px; }
.FBadge { display:inline-block; background:rgba(0,212,255,.1); border:1px solid rgba(0,212,255,.3); color:#00d4ff; font-family:'Rajdhani',sans-serif; font-size:11px; font-weight:700; letter-spacing:3px; text-transform:uppercase; padding:6px 18px; border-radius:30px; margin-bottom:16px; }
.FTitle { font-family:'Bebas Neue',sans-serif; font-size:clamp(36px,5vw,52px); letter-spacing:3px; color:#fff; margin:0; text-shadow:0 0 30px rgba(33,150,243,.3); }
.FTitle span { color:#00d4ff; }
.FDiv { width:60px; height:3px; background:linear-gradient(90deg,#1a6fd4,#00d4ff); margin:14px auto; border-radius:2px; }
.FSub { font-family:'Inter',sans-serif; font-size:14px; font-weight:300; color:rgba(255,255,255,.4); margin:0; }

/* Form */
.AttForm { display:flex; flex-direction:column; gap:24px; }
.FGroup { display:flex; flex-direction:column; gap:10px; }
.FLabel { font-family:'Rajdhani',sans-serif; font-size:11px; font-weight:700; letter-spacing:2.5px; text-transform:uppercase; color:rgba(255,255,255,.42); display:flex; align-items:center; gap:10px; }
.ProTag { background:linear-gradient(135deg,rgba(255,214,0,.2),rgba(255,152,0,.1)); border:1px solid rgba(255,214,0,.35); color:#ffd600; font-size:10px; font-weight:700; letter-spacing:1.5px; padding:2px 8px; border-radius:10px; }

/* Status toggle */
.SToggle { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.SBtn { padding:14px; border-radius:12px; border:1px solid rgba(255,255,255,.1); background:rgba(255,255,255,.04); color:rgba(255,255,255,.35); font-family:'Rajdhani',sans-serif; font-size:15px; font-weight:700; letter-spacing:1px; cursor:pointer; transition:all .2s; }
.SBtn-present { background:rgba(0,230,118,.12)!important; border-color:rgba(0,230,118,.4)!important; color:#00e676!important; }
.SBtn-absent  { background:rgba(255,68,68,.12)!important; border-color:rgba(255,68,68,.4)!important; color:#ff4444!important; }

/* Weight input */
.WBox { position:relative; }
.WInput { width:100%; background:rgba(10,22,40,.8); border:1px solid rgba(26,111,212,.35); border-radius:12px; color:#fff; font-family:'Bebas Neue',sans-serif; font-size:30px; letter-spacing:2px; padding:13px 56px 13px 20px; outline:none; transition:border-color .2s; box-sizing:border-box; }
.WInput:focus { border-color:#00d4ff; }
.WInput::placeholder { color:rgba(255,255,255,.15); }
.WUnit { position:absolute; right:16px; top:50%; transform:translateY(-50%); font-family:'Rajdhani',sans-serif; font-size:14px; font-weight:700; color:#00d4ff; letter-spacing:1px; }

/* Exercise grid */
.ExHint { font-family:'Inter',sans-serif; font-size:13px; font-weight:300; color:rgba(255,255,255,.3); margin:0; }
.ExGrid { display:grid; grid-template-columns:repeat(5,1fr); gap:8px; }
.ExChip { display:flex; flex-direction:column; align-items:center; gap:4px; padding:10px 5px; background:rgba(10,22,40,.7); border:1px solid rgba(26,111,212,.2); border-radius:12px; cursor:pointer; font-family:'Rajdhani',sans-serif; font-size:11px; font-weight:600; color:rgba(255,255,255,.38); letter-spacing:.3px; transition:all .18s; }
.ExChip:hover { border-color:rgba(0,212,255,.32); color:rgba(255,255,255,.65); }
.ExChip.ex-on { background:rgba(0,212,255,.12)!important; border-color:#00d4ff!important; color:#00d4ff!important; box-shadow:0 0 10px rgba(0,212,255,.15); }
.ExIco { font-size:18px; }
.ExCnt { font-family:'Rajdhani',sans-serif; font-size:12px; font-weight:700; color:#00d4ff; letter-spacing:1px; text-transform:uppercase; margin:0; }

/* Feedback */
.FErr  { background:rgba(255,68,68,.1); border:1px solid rgba(255,68,68,.3); color:#ff4444; padding:12px 16px; border-radius:10px; font-family:'Rajdhani',sans-serif; font-size:14px; font-weight:600; }
.FOk   { background:rgba(0,230,118,.1); border:1px solid rgba(0,230,118,.3); color:#00e676; padding:12px 16px; border-radius:10px; font-family:'Rajdhani',sans-serif; font-size:14px; font-weight:600; }

/* Submit button */
.SubmitBtn { width:100%; padding:16px; border-radius:14px; border:none; cursor:pointer; font-family:'Rajdhani',sans-serif; font-size:17px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#fff; background:linear-gradient(135deg,#1a6fd4,#2196f3); box-shadow:0 6px 24px rgba(33,150,243,.4); transition:all .22s; }
.SubmitBtn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 10px 32px rgba(33,150,243,.6); }
.SubmitBtn:disabled { opacity:.6; cursor:not-allowed; }

/* Already marked */
.Already { text-align:center; padding:20px 0; }
.AlIco   { font-size:60px; display:block; margin-bottom:14px; }
.AlTitle { font-family:'Bebas Neue',sans-serif; font-size:36px; letter-spacing:2px; color:#fff; margin:0 0 8px; }
.AlSub   { font-family:'Rajdhani',sans-serif; font-size:16px; color:rgba(255,255,255,.45); margin:0 0 22px; }
.AlExLbl { font-family:'Rajdhani',sans-serif; font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:rgba(255,255,255,.28); margin:0 0 10px; }
.AlExChips { display:flex; flex-wrap:wrap; justify-content:center; gap:8px; }
.AlExChip  { background:rgba(0,212,255,.1); border:1px solid rgba(0,212,255,.25); color:#00d4ff; font-family:'Rajdhani',sans-serif; font-size:13px; font-weight:700; padding:5px 14px; border-radius:20px; }

@keyframes fadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
@media(max-width:480px){ .FCard{padding:28px 18px} .ExGrid{grid-template-columns:repeat(4,1fr)} }
`;

const EXERCISES = [
  { name:'Chest',     icon:'💪' },
  { name:'Biceps',    icon:'🦾' },
  { name:'Triceps',   icon:'💥' },
  { name:'Legs',      icon:'🦵' },
  { name:'Back',      icon:'🏋️' },
  { name:'Shoulders', icon:'🔱' },
  { name:'Cardio',    icon:'🏃' },
  { name:'Full Body', icon:'⚡' },
  { name:'Arms',      icon:'🤜' },
  { name:'Core',      icon:'🎯' },
];

export default function AttendenceForm() {
  const email = localStorage.getItem('userEmail');

  const [isPro,         setIsPro]         = useState(false);
  const [weight,        setWeight]        = useState('');
  const [status,        setStatus]        = useState('Present');
  const [selectedEx,    setSelectedEx]    = useState([]);
  const [alreadyMarked, setAlreadyMarked] = useState(false);
  const [markedStatus,  setMarkedStatus]  = useState(null);
  const [todayEx,       setTodayEx]       = useState([]);
  const [submitting,    setSubmitting]    = useState(false);
  const [success,       setSuccess]       = useState(false);
  const [error,         setError]         = useState('');

  useEffect(() => {
    if (!email) return;

    // Check if today already marked
    axios.get(apiUrl(`/api/attendance/check-today?email=${email}`))
      .then(r => {
        if (r.data.marked) {
          setAlreadyMarked(true);
          setMarkedStatus(r.data.status);
          setTodayEx(r.data.exercises || []);
        }
      }).catch(console.error);

    // Check Pro status
    axios.get(apiUrl(`/api/payment/status?email=${email}`))
      .then(r => {
        setIsPro(r.data.isPro);
        syncStoredProStatus(r.data);
      }).catch(() => {});
  }, [email]);

  const toggleEx = (name) =>
    setSelectedEx(p => p.includes(name) ? p.filter(e => e !== name) : [...p, name]);

  const handleSubmit = async () => {
    if (!weight) { setError('Please enter your weight.'); return; }
    setSubmitting(true); setError('');

    try {
      // 1. Submit attendance
      await axios.post(apiUrl('/api/attendance/mark'), {
        email, status, weight: parseFloat(weight),
      });

      // 2. Log exercises (Pro + Present + at least one selected)
      if (isPro && status === 'Present' && selectedEx.length > 0) {
        await axios.post(apiUrl('/api/exercises/log'), {
          email, exercises: selectedEx,
        });
      }

      setSuccess(true);
      setAlreadyMarked(true);
      setMarkedStatus(status);
      setTodayEx(selectedEx);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Already marked screen ── */
  if (alreadyMarked) return (
    <>
      <style>{css}</style>
      <div className="FPage">
        <div className="FCard">
          <div className="Already">
            <span className="AlIco">{markedStatus === 'Present' ? '✅' : '❌'}</span>
            <h2 className="AlTitle">Already Submitted</h2>
            <p className="AlSub">
              You marked{' '}
              <strong style={{ color: markedStatus === 'Present' ? '#00e676' : '#ff4444' }}>
                {markedStatus}
              </strong>{' '}
              today.
            </p>
            {todayEx.length > 0 && (
              <>
                <div className="AlExLbl">Today's Exercises</div>
                <div className="AlExChips">
                  {todayEx.map(e => <span key={e} className="AlExChip">{e}</span>)}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );

  /* ── Main form ── */
  return (
    <>
      <style>{css}</style>
      <div className="FPage">
        <div className="FCard">

          <div className="FHdr">
            <div className="FBadge">Daily Check-In</div>
            <h1 className="FTitle">Mark <span>Attendance</span></h1>
            <div className="FDiv" />
            <p className="FSub">Log your presence and track your progress.</p>
          </div>

          <div className="AttForm">

            {/* Status */}
            <div className="FGroup">
              <label className="FLabel">Attendance Status</label>
              <div className="SToggle">
                <button type="button"
                  className={`SBtn ${status === 'Present' ? 'SBtn-present' : ''}`}
                  onClick={() => setStatus('Present')}>
                  ✅ Present
                </button>
                <button type="button"
                  className={`SBtn ${status === 'Absent' ? 'SBtn-absent' : ''}`}
                  onClick={() => setStatus('Absent')}>
                  ❌ Absent
                </button>
              </div>
            </div>

            {/* Weight */}
            <div className="FGroup">
              <label className="FLabel">Today's Weight</label>
              <div className="WBox">
                <input className="WInput" type="number" step="0.1" min="0" placeholder="75.5"
                  value={weight} onChange={e => setWeight(e.target.value)} />
                <span className="WUnit">kg</span>
              </div>
            </div>

            {/* Exercise grid — Pro + Present only */}
            {isPro && status === 'Present' && (
              <div className="FGroup">
                <label className="FLabel">
                  Exercises Today
                  <span className="ProTag">⭐ Pro</span>
                </label>
                <p className="ExHint">Select all muscle groups you trained today.</p>
                <div className="ExGrid">
                  {EXERCISES.map(ex => (
                    <button key={ex.name} type="button"
                      className={`ExChip ${selectedEx.includes(ex.name) ? 'ex-on' : ''}`}
                      onClick={() => toggleEx(ex.name)}>
                      <span className="ExIco">{ex.icon}</span>
                      {ex.name}
                    </button>
                  ))}
                </div>
                {selectedEx.length > 0 && (
                  <p className="ExCnt">{selectedEx.length} exercise{selectedEx.length !== 1 ? 's' : ''} selected</p>
                )}
              </div>
            )}

            {/* Feedback */}
            {error   && <div className="FErr">{error}</div>}
            {success && (
              <div className="FOk">
                ✅ Attendance submitted!
                {selectedEx.length > 0 ? ` Logged ${selectedEx.length} exercise(s).` : ''}
              </div>
            )}

            <button className="SubmitBtn" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Attendance'}
            </button>

          </div>
        </div>
      </div>
    </>
  );
}
