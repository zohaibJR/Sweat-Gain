import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { apiUrl } from '../../config/api';

const css = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');

.FPage { min-height:100vh; background:radial-gradient(circle at top, rgba(0,212,255,.12), transparent 35%), linear-gradient(180deg,#07101f 0%,#0b1730 45%,#081223 100%); position:relative; display:flex; align-items:center; justify-content:center; padding:40px 20px; overflow:hidden; }
.FPage::before { content:''; position:fixed; inset:0; pointer-events:none; z-index:0; background-image:linear-gradient(rgba(26,111,212,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(26,111,212,.08) 1px,transparent 1px); background-size:58px 58px; }
.FPage::after { content:''; position:absolute; width:520px; height:520px; top:-220px; right:-120px; border-radius:50%; background:radial-gradient(circle, rgba(0,212,255,.18), transparent 70%); filter:blur(30px); }

.FCard { position:relative; z-index:1; width:100%; max-width:1080px; display:grid; grid-template-columns:1.05fr .95fr; gap:22px; animation:fadeUp .55s ease both; }
.FPanel { background:rgba(11,23,48,.78); border:1px solid rgba(78,157,255,.18); box-shadow:0 18px 60px rgba(0,0,0,.24); backdrop-filter:blur(18px); border-radius:28px; padding:34px; }
.HeroPanel { overflow:hidden; position:relative; }
.HeroPanel::before { content:''; position:absolute; inset:auto -40px -60px auto; width:220px; height:220px; border-radius:50%; background:radial-gradient(circle, rgba(26,111,212,.22), transparent 70%); }
.FormPanel { position:relative; }

.Badge { display:inline-flex; align-items:center; gap:8px; padding:7px 16px; border-radius:999px; background:rgba(0,212,255,.1); border:1px solid rgba(0,212,255,.28); color:#84efff; font:700 11px 'Rajdhani',sans-serif; letter-spacing:2px; text-transform:uppercase; }
.HeroTitle { font:400 clamp(48px,7vw,82px) 'Bebas Neue',sans-serif; line-height:.95; letter-spacing:3px; color:#fff; margin:20px 0 12px; }
.HeroTitle span { color:#00d4ff; }
.HeroCopy { margin:0; max-width:480px; color:rgba(255,255,255,.68); font:400 15px/1.7 'Inter',sans-serif; }
.HighlightGrid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-top:30px; }
.HighlightCard { padding:18px 16px; border-radius:18px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.06); }
.HighlightValue { display:block; color:#fff; font:400 28px/1 'Bebas Neue',sans-serif; letter-spacing:1px; margin-bottom:8px; }
.HighlightLabel { display:block; color:rgba(255,255,255,.45); font:700 11px 'Rajdhani',sans-serif; letter-spacing:2px; text-transform:uppercase; }

.SectionTop { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; margin-bottom:24px; }
.SectionTitle { margin:0; color:#fff; font:400 42px/1 'Bebas Neue',sans-serif; letter-spacing:2px; }
.SectionText { margin:8px 0 0; color:rgba(255,255,255,.5); font:400 14px/1.6 'Inter',sans-serif; }
.StatePill { padding:8px 14px; border-radius:999px; font:700 11px 'Rajdhani',sans-serif; letter-spacing:2px; text-transform:uppercase; white-space:nowrap; }
.StatePill.present { background:rgba(0,230,118,.12); border:1px solid rgba(0,230,118,.35); color:#00e676; }
.StatePill.absent { background:rgba(255,85,85,.12); border:1px solid rgba(255,85,85,.35); color:#ff7777; }

.StatusCard { padding:18px 20px; border-radius:20px; margin-bottom:20px; border:1px solid rgba(255,255,255,.08); }
.StatusCard.auto { background:linear-gradient(135deg, rgba(255,85,85,.12), rgba(255,140,0,.08)); border-color:rgba(255,120,120,.22); }
.StatusCard.present { background:linear-gradient(135deg, rgba(0,230,118,.12), rgba(0,212,255,.08)); border-color:rgba(0,230,118,.2); }
.StatusTitle { margin:0 0 8px; color:#fff; font:700 18px 'Rajdhani',sans-serif; letter-spacing:.4px; }
.StatusText { margin:0; color:rgba(255,255,255,.68); font:400 14px/1.7 'Inter',sans-serif; }
.Deadline { margin-top:14px; display:flex; flex-wrap:wrap; gap:10px; }
.DeadlineChip { padding:9px 12px; border-radius:12px; background:rgba(8,18,35,.52); border:1px solid rgba(255,255,255,.08); color:#dffaff; font:600 12px 'Inter',sans-serif; }

.AttForm { display:flex; flex-direction:column; gap:18px; }
.Field { display:flex; flex-direction:column; gap:9px; }
.Label { color:rgba(255,255,255,.5); font:700 11px 'Rajdhani',sans-serif; letter-spacing:2px; text-transform:uppercase; display:flex; align-items:center; gap:10px; }
.ProTag { background:rgba(255,214,0,.12); border:1px solid rgba(255,214,0,.28); color:#ffd863; padding:3px 8px; border-radius:999px; font-size:10px; }
.InputWrap { position:relative; }
.Input { width:100%; box-sizing:border-box; border:none; outline:none; background:rgba(5,12,23,.78); border:1px solid rgba(0,212,255,.18); border-radius:18px; color:#fff; padding:16px 62px 16px 18px; font:400 30px 'Bebas Neue',sans-serif; letter-spacing:1.4px; transition:border-color .2s, box-shadow .2s; }
.Input:focus { border-color:#00d4ff; box-shadow:0 0 0 4px rgba(0,212,255,.1); }
.Unit { position:absolute; right:16px; top:50%; transform:translateY(-50%); color:#00d4ff; font:700 13px 'Rajdhani',sans-serif; letter-spacing:2px; }
.HelpText { margin:0; color:rgba(255,255,255,.38); font:400 12px/1.6 'Inter',sans-serif; }

.ExGrid { display:grid; grid-template-columns:repeat(5,1fr); gap:9px; }
.ExChip { min-height:84px; border:none; cursor:pointer; border-radius:18px; background:rgba(5,12,23,.78); border:1px solid rgba(255,255,255,.06); color:rgba(255,255,255,.54); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px; font:700 12px 'Rajdhani',sans-serif; letter-spacing:.4px; transition:transform .15s, border-color .15s, color .15s, background .15s; }
.ExChip:hover { transform:translateY(-2px); border-color:rgba(0,212,255,.28); color:#fff; }
.ExChip.active { background:linear-gradient(135deg, rgba(0,212,255,.16), rgba(26,111,212,.14)); border-color:#00d4ff; color:#aef7ff; box-shadow:0 10px 24px rgba(0,212,255,.12); }
.ExIcon { font-size:18px; }

.Message { padding:13px 14px; border-radius:14px; font:600 13px/1.5 'Inter',sans-serif; }
.Message.error { background:rgba(255,68,68,.1); border:1px solid rgba(255,68,68,.26); color:#ff8e8e; }
.Message.success { background:rgba(0,230,118,.1); border:1px solid rgba(0,230,118,.24); color:#83ffc2; }

.ActionBtn { border:none; cursor:pointer; width:100%; padding:16px 18px; border-radius:18px; background:linear-gradient(135deg,#1a6fd4,#00d4ff); color:#fff; font:700 16px 'Rajdhani',sans-serif; letter-spacing:2px; text-transform:uppercase; box-shadow:0 14px 28px rgba(0,130,255,.2); transition:transform .18s, box-shadow .18s, opacity .18s; }
.ActionBtn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 18px 34px rgba(0,130,255,.28); }
.ActionBtn:disabled { opacity:.58; cursor:not-allowed; }

.SummaryList { display:flex; flex-direction:column; gap:12px; margin-top:22px; }
.SummaryItem { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:14px 16px; border-radius:16px; background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.05); }
.SummaryKey { color:rgba(255,255,255,.42); font:700 11px 'Rajdhani',sans-serif; letter-spacing:2px; text-transform:uppercase; }
.SummaryVal { color:#fff; font:700 15px 'Rajdhani',sans-serif; text-align:right; }
.ExerciseWrap { display:flex; flex-wrap:wrap; gap:8px; justify-content:flex-end; }
.ExerciseTag { padding:6px 10px; border-radius:999px; background:rgba(0,212,255,.1); border:1px solid rgba(0,212,255,.22); color:#8eefff; font:700 11px 'Rajdhani',sans-serif; letter-spacing:1px; text-transform:uppercase; }

@keyframes fadeUp { from{opacity:0; transform:translateY(24px)} to{opacity:1; transform:translateY(0)} }

@media (max-width: 920px) {
  .FCard { grid-template-columns:1fr; }
  .HighlightGrid { grid-template-columns:1fr; }
}

@media (max-width: 640px) {
  .FPanel { padding:24px 18px; border-radius:22px; }
  .SectionTop { flex-direction:column; }
  .ExGrid { grid-template-columns:repeat(2,1fr); }
  .SummaryItem { flex-direction:column; align-items:flex-start; }
  .ExerciseWrap { justify-content:flex-start; }
}
`;

const EXERCISES = [
  { name: 'Chest', icon: 'CH' },
  { name: 'Biceps', icon: 'BI' },
  { name: 'Triceps', icon: 'TR' },
  { name: 'Legs', icon: 'LG' },
  { name: 'Back', icon: 'BK' },
  { name: 'Shoulders', icon: 'SH' },
  { name: 'Cardio', icon: 'CA' },
  { name: 'Full Body', icon: 'FB' },
  { name: 'Arms', icon: 'AR' },
  { name: 'Core', icon: 'CO' },
];

const formatDateTime = (value) =>
  value
    ? new Date(value).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : 'Not available';

export default function AttendenceForm() {
  const email = localStorage.getItem('userEmail');

  const [isPro, setIsPro] = useState(false);
  const [attendance, setAttendance] = useState(null);
  const [weight, setWeight] = useState('');
  const [selectedEx, setSelectedEx] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadAttendance = async () => {
    if (!email) return;

    const [{ data: attendanceData }, paymentResult] = await Promise.all([
      axios.get(apiUrl(`/api/attendance/check-today?email=${email}`)),
      axios.get(apiUrl(`/api/payment/status?email=${email}`)).catch(() => ({ data: { isPro: false } })),
    ]);

    setAttendance(attendanceData);
    setWeight(attendanceData?.status === 'Present' && attendanceData?.weight ? String(attendanceData.weight) : '');
    setSelectedEx(attendanceData?.exercises || []);
    setIsPro(Boolean(paymentResult?.data?.isPro));
  };

  useEffect(() => {
    loadAttendance().catch(() => setError('Unable to load today check-in right now.'));
  }, [email]);

  const toggleExercise = (name) => {
    setSelectedEx((current) =>
      current.includes(name) ? current.filter((exercise) => exercise !== name) : [...current, name]
    );
  };

  const handleSubmit = async () => {
    if (!weight.trim()) {
      setError('Enter today weight to convert the absent mark into a present check-in.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        email,
        weight: Number.parseFloat(weight),
        exercises: isPro ? selectedEx : [],
      };

      const response = await axios.post(apiUrl('/api/attendance/mark'), payload);
      setAttendance(response.data.record);
      setSuccess('Today check-in is saved and your status is now Present.');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save today check-in.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!email) {
    return (
      <>
        <style>{css}</style>
        <div className="FPage">
          <div className="FCard">
            <div className="FPanel FormPanel">
              <div className="Message error">Sign in first to manage attendance.</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const isPresent = attendance?.status === 'Present';
  const isAbsent = attendance?.status === 'Absent';
  const canCheckIn = Boolean(attendance?.canCheckIn);

  return (
    <>
      <style>{css}</style>
      <div className="FPage">
        <div className="FCard">
          <div className="FPanel HeroPanel">
            <span className="Badge">Daily Attendance Flow</span>
            <h1 className="HeroTitle">
              Absent <span>First</span>.
              <br />
              Check In <span>Later</span>.
            </h1>
            <p className="HeroCopy">
              Every day begins with an automatic Absent placeholder. When the member enters weight and saves the record,
              that day becomes Present. The update window stays open for 36 hours from the day mark.
            </p>

            <div className="HighlightGrid">
              <div className="HighlightCard">
                <span className="HighlightValue">Auto Absent</span>
                <span className="HighlightLabel">Created for today by backend</span>
              </div>
              <div className="HighlightCard">
                <span className="HighlightValue">36 Hours</span>
                <span className="HighlightLabel">Allowed to check in</span>
              </div>
              <div className="HighlightCard">
                <span className="HighlightValue">Present</span>
                <span className="HighlightLabel">After user updates weight</span>
              </div>
            </div>
          </div>

          <div className="FPanel FormPanel">
            <div className="SectionTop">
              <div>
                <h2 className="SectionTitle">Today Status</h2>
                <p className="SectionText">The card below reflects the backend rule directly.</p>
              </div>
              {attendance?.status && (
                <span className={`StatePill ${isPresent ? 'present' : 'absent'}`}>{attendance.status}</span>
              )}
            </div>

            {attendance && isAbsent && (
              <div className="StatusCard auto">
                <h3 className="StatusTitle">Auto-marked as absent</h3>
                <p className="StatusText">
                  This day started as Absent automatically because no manual check-in existed yet.
                  {canCheckIn
                    ? ' Add your weight now to switch it to Present.'
                    : ' The 36-hour update window is already closed.'}
                </p>
                <div className="Deadline">
                  <span className="DeadlineChip">Window ends: {formatDateTime(attendance.editableUntil)}</span>
                  <span className="DeadlineChip">Source: {attendance.source || 'auto'}</span>
                </div>
              </div>
            )}

            {attendance && isPresent && (
              <div className="StatusCard present">
                <h3 className="StatusTitle">Checked in successfully</h3>
                <p className="StatusText">
                  Today has already been converted to Present and is now counted in your attendance record.
                </p>
                <div className="Deadline">
                  <span className="DeadlineChip">Checked in: {formatDateTime(attendance.checkedInAt)}</span>
                  <span className="DeadlineChip">Weight: {attendance.weight} kg</span>
                </div>
              </div>
            )}

            {error && <div className="Message error">{error}</div>}
            {success && <div className="Message success">{success}</div>}

            {attendance && canCheckIn ? (
              <div className="AttForm">
                <div className="Field">
                  <label className="Label">Today Weight</label>
                  <div className="InputWrap">
                    <input
                      className="Input"
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="75.5"
                      value={weight}
                      onChange={(event) => setWeight(event.target.value)}
                    />
                    <span className="Unit">KG</span>
                  </div>
                  <p className="HelpText">Saving a weight turns today from Absent to Present.</p>
                </div>

                {isPro && (
                  <div className="Field">
                    <label className="Label">
                      Workout Tags
                      <span className="ProTag">Pro</span>
                    </label>
                    <div className="ExGrid">
                      {EXERCISES.map((exercise) => (
                        <button
                          key={exercise.name}
                          type="button"
                          className={`ExChip ${selectedEx.includes(exercise.name) ? 'active' : ''}`}
                          onClick={() => toggleExercise(exercise.name)}
                        >
                          <span className="ExIcon">{exercise.icon}</span>
                          <span>{exercise.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button className="ActionBtn" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? 'Saving Check-In...' : 'Mark Present'}
                </button>
              </div>
            ) : attendance ? (
              <div className="SummaryList">
                <div className="SummaryItem">
                  <span className="SummaryKey">Current State</span>
                  <span className="SummaryVal">{attendance.status}</span>
                </div>
                <div className="SummaryItem">
                  <span className="SummaryKey">Editable Until</span>
                  <span className="SummaryVal">{formatDateTime(attendance.editableUntil)}</span>
                </div>
                <div className="SummaryItem">
                  <span className="SummaryKey">Exercises</span>
                  <div className="ExerciseWrap">
                    {attendance.exercises?.length ? (
                      attendance.exercises.map((exercise) => <span key={exercise} className="ExerciseTag">{exercise}</span>)
                    ) : (
                      <span className="SummaryVal">No workout tags</span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="Message error">Loading today attendance...</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

