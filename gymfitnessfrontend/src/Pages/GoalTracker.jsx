import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../config/api';
import { syncStoredProStatus } from '../utils/proStatus';

/* ─────────────────────────────────── CSS ─────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');

.GPage { min-height:100vh; background:#0a1628; position:relative; overflow-x:hidden; }
.GPage::before { content:''; position:fixed; inset:0; pointer-events:none; z-index:0;
  background-image:linear-gradient(rgba(26,111,212,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(26,111,212,.07) 1px,transparent 1px);
  background-size:60px 60px; }
.GInner { position:relative; z-index:1; max-width:760px; margin:0 auto; padding:60px 24px 80px; }

/* Header */
.GHdr  { text-align:center; margin-bottom:44px; animation:fadeUp .6s ease both; }
.GBadge { display:inline-block; background:linear-gradient(135deg,rgba(255,214,0,.2),rgba(255,152,0,.1)); border:1px solid rgba(255,214,0,.4); color:#ffd600; font-family:'Rajdhani',sans-serif; font-size:12px; font-weight:700; letter-spacing:3px; text-transform:uppercase; padding:7px 20px; border-radius:40px; margin-bottom:20px; }
.GTitle { font-family:'Bebas Neue',sans-serif; font-size:clamp(44px,7vw,68px); letter-spacing:3px; color:#fff; margin:0; text-shadow:0 0 40px rgba(33,150,243,.3); }
.GTitle span { color:#00d4ff; }
.GDiv { width:70px; height:3px; background:linear-gradient(90deg,#1a6fd4,#00d4ff); margin:16px auto; border-radius:2px; }
.GSub { font-family:'Inter',sans-serif; font-size:15px; font-weight:300; color:rgba(255,255,255,.5); margin:0; }

/* Loading */
.GLoad { display:flex; flex-direction:column; align-items:center; gap:16px; padding:60px; color:rgba(255,255,255,.3); font-family:'Rajdhani',sans-serif; }
.GSpin { width:36px; height:36px; border:3px solid rgba(26,111,212,.2); border-top-color:#00d4ff; border-radius:50%; animation:spin .75s linear infinite; }

/* Locked / upgrade */
.GLock { text-align:center; padding:80px 20px; animation:fadeUp .5s ease both; }
.GLockIcon { font-size:64px; display:block; margin-bottom:20px; }
.GLockTitle { font-family:'Bebas Neue',sans-serif; font-size:48px; letter-spacing:3px; color:#fff; margin:0 0 12px; }
.GLockDiv { width:60px; height:3px; background:linear-gradient(90deg,#1a6fd4,#00d4ff); margin:0 auto 20px; border-radius:2px; }
.GLockDesc { font-family:'Inter',sans-serif; font-size:15px; font-weight:300; color:rgba(255,255,255,.5); margin:0 auto 32px; max-width:420px; line-height:1.65; }
.GLockBtn { padding:14px 36px; border-radius:14px; border:none; cursor:pointer; font-family:'Rajdhani',sans-serif; font-size:16px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#fff; background:linear-gradient(135deg,#1a6fd4,#2196f3); box-shadow:0 6px 24px rgba(33,150,243,.4); transition:all .22s; }
.GLockBtn:hover { transform:translateY(-2px); box-shadow:0 10px 32px rgba(33,150,243,.6); }

/* Goal card */
.GCard { background:rgba(15,31,61,.82); backdrop-filter:blur(14px); border:1px solid rgba(26,111,212,.3); border-radius:24px; padding:32px; animation:fadeUp .5s .1s ease both; }
.GCard.gach { border-color:rgba(255,214,0,.5); box-shadow:0 0 40px rgba(255,214,0,.08); }
.AchBanner { background:linear-gradient(135deg,rgba(255,214,0,.18),rgba(255,152,0,.08)); border:1px solid rgba(255,214,0,.4); border-radius:12px; color:#ffd600; font-family:'Bebas Neue',sans-serif; font-size:22px; letter-spacing:2px; text-align:center; padding:13px; margin-bottom:24px; }

/* Stats row */
.GStats { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:28px; flex-wrap:wrap; }
.GStat { display:flex; flex-direction:column; align-items:center; gap:6px; flex:1; text-align:center; }
.GStatLbl { font-family:'Rajdhani',sans-serif; font-size:11px; font-weight:700; letter-spacing:2.5px; text-transform:uppercase; color:rgba(255,255,255,.32); }
.GStatVal { font-family:'Bebas Neue',sans-serif; font-size:42px; color:#fff; line-height:1; }
.GStatVal small { font-size:18px; color:rgba(255,255,255,.22); }
.c-cyan  { color:#00d4ff!important; }
.c-green { color:#00e676!important; }
.GArrow  { color:rgba(255,255,255,.15); font-size:22px; }

/* Progress */
.GProgSec { margin-bottom:24px; }
.GProgHdr { display:flex; justify-content:space-between; font-family:'Rajdhani',sans-serif; font-size:12px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:rgba(255,255,255,.3); margin-bottom:10px; }
.GProgPct { color:#00d4ff; }
.GProgTrack { height:10px; background:rgba(255,255,255,.07); border-radius:99px; overflow:hidden; }
.GProgFill { height:100%; background:linear-gradient(90deg,#1a6fd4,#00d4ff); border-radius:99px; transition:width 1.2s cubic-bezier(.4,0,.2,1); box-shadow:0 0 12px rgba(0,212,255,.4); }
.GProgFill.pf-done { background:linear-gradient(90deg,#ffd600,#ff9800); box-shadow:0 0 12px rgba(255,214,0,.4); }

/* Meta chips */
.GMeta { display:flex; flex-wrap:wrap; gap:10px; margin-bottom:24px; }
.GChip { font-family:'Rajdhani',sans-serif; font-size:13px; font-weight:600; padding:6px 14px; border-radius:20px; letter-spacing:.3px; }
.gc-dir  { background:rgba(0,212,255,.1); border:1px solid rgba(0,212,255,.3); color:#00d4ff; }
.gc-days { background:rgba(33,150,243,.1); border:1px solid rgba(33,150,243,.3); color:#4db6ff; }
.gc-urg  { background:rgba(255,152,0,.1); border:1px solid rgba(255,152,0,.4); color:#ff9800; }
.gc-note { background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.1); color:rgba(255,255,255,.45); }

/* Buttons */
.GBtns { display:flex; gap:12px; }
.GBtn { padding:12px 24px; border-radius:12px; border:none; cursor:pointer; font-family:'Rajdhani',sans-serif; font-size:14px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; transition:all .22s; }
.gb-primary { background:linear-gradient(135deg,#1a6fd4,#2196f3); color:#fff; box-shadow:0 4px 18px rgba(33,150,243,.35); }
.gb-primary:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 28px rgba(33,150,243,.55); }
.gb-edit   { background:rgba(0,212,255,.1); border:1px solid rgba(0,212,255,.3); color:#00d4ff; }
.gb-edit:hover { background:rgba(0,212,255,.18); }
.gb-del    { background:rgba(255,68,68,.1); border:1px solid rgba(255,68,68,.3); color:#ff4444; }
.gb-del:hover { background:rgba(255,68,68,.2); }

/* No goal */
.GEmpty { text-align:center; padding:60px 20px; animation:fadeUp .5s .1s ease both; }
.GEmptyIcon { font-size:56px; display:block; margin-bottom:16px; }
.GEmpty p { font-family:'Rajdhani',sans-serif; font-size:16px; color:rgba(255,255,255,.35); margin-bottom:24px; letter-spacing:.5px; }

/* Form overlay */
.GOverlay { position:fixed; inset:0; background:rgba(0,0,0,.82); backdrop-filter:blur(6px); z-index:100; display:flex; align-items:center; justify-content:center; padding:24px; }
.GForm { background:rgba(15,31,61,.97); border:1px solid rgba(0,212,255,.35); border-radius:24px; padding:36px 32px; width:100%; max-width:460px; display:flex; flex-direction:column; gap:20px; animation:fadeUp .3s ease both; }
.GFormTitle { font-family:'Bebas Neue',sans-serif; font-size:32px; letter-spacing:2px; color:#fff; margin:0; }
.GFGroup { display:flex; flex-direction:column; gap:8px; }
.GFLabel { font-family:'Rajdhani',sans-serif; font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#00d4ff; }
.GFInput { background:rgba(10,22,40,.85); border:1px solid rgba(26,111,212,.35); border-radius:10px; color:#fff; font-family:'Rajdhani',sans-serif; font-size:15px; padding:11px 16px; outline:none; transition:border-color .2s; }
.GFInput:focus { border-color:#00d4ff; }
.GFormBtns { display:flex; gap:12px; }

@keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
@keyframes spin   { to{transform:rotate(360deg)} }
@media(max-width:600px){ .GStats{flex-direction:column} .GBtns{flex-direction:column} }
`;

export default function GoalTracker() {
  const email    = localStorage.getItem('userEmail');
  const navigate = useNavigate();

  const [isPro,    setIsPro]    = useState(null); // null = checking
  const [goal,     setGoal]     = useState(null);
  const [progress, setProgress] = useState(0);
  const [daysLeft, setDaysLeft] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [form, setForm] = useState({ targetWeight:'', targetDate:'', notes:'' });

  /* ── Check Pro + fetch goal ── */
  useEffect(() => {
    if (!email) return;
    axios.get(apiUrl(`/api/payment/status?email=${email}`))
      .then(r => {
        setIsPro(r.data.isPro);
        syncStoredProStatus(r.data);
        if (r.data.isPro) fetchGoal();
        else setLoading(false);
      })
      .catch(() => { setIsPro(false); setLoading(false); });
  }, [email]);

  const fetchGoal = async () => {
    setLoading(true);
    try {
      const r = await axios.get(apiUrl(`/api/goals?email=${email}`));
      setGoal(r.data.goal);
      setProgress(r.data.progress || 0);
      setDaysLeft(r.data.daysRemaining);
    } catch (err) {
      if (err.response?.status === 403) setIsPro(false);
    } finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (!form.targetWeight) { alert('Target weight is required.'); return; }
    setSaving(true);
    try {
      await axios.post(apiUrl('/api/goals'), { email, ...form });
      setShowForm(false);
      fetchGoal();
    } catch (err) { alert(err.response?.data?.message || 'Failed to save.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete your current goal?')) return;
    try {
      await axios.delete(apiUrl(`/api/goals?email=${email}`));
      setGoal(null); setProgress(0); setDaysLeft(null);
    } catch { alert('Failed to delete.'); }
  };

  const openEdit = () => {
    setForm({
      targetWeight: goal.targetWeight,
      targetDate:   goal.targetDate ? goal.targetDate.slice(0, 10) : '',
      notes:        goal.notes || '',
    });
    setShowForm(true);
  };

  const direction = goal ? (goal.startWeight > goal.targetWeight ? 'Loss' : 'Gain') : null;

  /* ── Not Pro ── */
  if (isPro === false) return (
    <>
      <style>{css}</style>
      <div className="GPage">
        <div className="GInner">
          <div className="GLock">
            <span className="GLockIcon">🔒</span>
            <div className="GLockTitle">Pro Feature</div>
            <div className="GLockDiv" />
            <p className="GLockDesc">
              Goal Tracking is a Pro-only feature. Upgrade for Rs 1,500/month
              and set your target weight, track progress and stay motivated.
            </p>
            <button className="GLockBtn" onClick={() => navigate('/pricing')}>
              ⚡ Upgrade to Pro
            </button>
          </div>
        </div>
      </div>
    </>
  );

  /* ── Loading ── */
  if (isPro === null || loading) return (
    <>
      <style>{css}</style>
      <div className="GPage">
        <div className="GInner">
          <div className="GLoad"><div className="GSpin" /><p>Loading...</p></div>
        </div>
      </div>
    </>
  );

  /* ── Main ── */
  return (
    <>
      <style>{css}</style>
      <div className="GPage">
        <div className="GInner">

          {/* Header */}
          <div className="GHdr">
            <div className="GBadge">⭐ Pro Feature</div>
            <h1 className="GTitle">Goal <span>Tracker</span></h1>
            <div className="GDiv" />
            <p className="GSub">Set your target weight and track every step of the journey.</p>
          </div>

          {/* Goal card */}
          {goal ? (
            <div className={`GCard ${goal.achieved ? 'gach' : ''}`}>
              {goal.achieved && <div className="AchBanner">🏆 Goal Achieved! Congratulations!</div>}

              <div className="GStats">
                <div className="GStat">
                  <span className="GStatLbl">Start Weight</span>
                  <span className="GStatVal">{goal.startWeight}<small>kg</small></span>
                </div>
                <div className="GArrow">→</div>
                <div className="GStat">
                  <span className="GStatLbl">Target Weight</span>
                  <span className="GStatVal c-cyan">{goal.targetWeight}<small>kg</small></span>
                </div>
                <div className="GArrow">|</div>
                <div className="GStat">
                  <span className="GStatLbl">Current Weight</span>
                  <span className="GStatVal c-green">{goal.currentWeight}<small>kg</small></span>
                </div>
              </div>

              <div className="GProgSec">
                <div className="GProgHdr">
                  <span>Progress</span>
                  <span className="GProgPct">{progress}%</span>
                </div>
                <div className="GProgTrack">
                  <div
                    className={`GProgFill ${goal.achieved ? 'pf-done' : ''}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="GMeta">
                <span className="GChip gc-dir">{direction === 'Loss' ? '📉 Weight Loss' : '📈 Weight Gain'}</span>
                {daysLeft !== null && (
                  <span className={`GChip ${daysLeft <= 7 ? 'gc-urg' : 'gc-days'}`}>
                    📅 {daysLeft} days remaining
                  </span>
                )}
                {goal.notes && <span className="GChip gc-note">📝 {goal.notes}</span>}
              </div>

              <div className="GBtns">
                <button className="GBtn gb-edit" onClick={openEdit}>✏️ Edit Goal</button>
                <button className="GBtn gb-del"  onClick={handleDelete}>🗑️ Delete</button>
              </div>
            </div>
          ) : (
            <div className="GEmpty">
              <span className="GEmptyIcon">🎯</span>
              <p>No goal set yet. Set your first weight goal!</p>
              <button className="GBtn gb-primary" onClick={() => { setForm({ targetWeight:'', targetDate:'', notes:'' }); setShowForm(true); }}>
                Set a Goal
              </button>
            </div>
          )}

          {/* Form modal */}
          {showForm && (
            <div className="GOverlay" onClick={() => setShowForm(false)}>
              <div className="GForm" onClick={e => e.stopPropagation()}>
                <div className="GFormTitle">{goal ? 'Update Goal' : 'Set New Goal'}</div>

                <div className="GFGroup">
                  <label className="GFLabel">Target Weight (kg) *</label>
                  <input className="GFInput" type="number" step="0.1" min="0" placeholder="e.g. 75"
                    value={form.targetWeight}
                    onChange={e => setForm(p => ({ ...p, targetWeight: e.target.value }))} />
                </div>

                <div className="GFGroup">
                  <label className="GFLabel">Target Date (optional)</label>
                  <input className="GFInput" type="date"
                    value={form.targetDate}
                    onChange={e => setForm(p => ({ ...p, targetDate: e.target.value }))} />
                </div>

                <div className="GFGroup">
                  <label className="GFLabel">Notes (optional)</label>
                  <input className="GFInput" type="text" placeholder="e.g. Summer cut goal"
                    value={form.notes}
                    onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
                </div>

                <div className="GFormBtns">
                  <button className="GBtn gb-primary" onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Goal'}
                  </button>
                  <button className="GBtn gb-del" onClick={() => setShowForm(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
