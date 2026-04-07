import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

/* ─────────────────────────────────── CSS ─────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');

.APage { min-height:100vh; background:#0a1628; position:relative; overflow-x:hidden; }
.APage::before { content:''; position:fixed; inset:0; pointer-events:none; z-index:0;
  background-image:linear-gradient(rgba(26,111,212,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(26,111,212,.07) 1px,transparent 1px);
  background-size:60px 60px; }

/* ── Login ── */
.LoginWrap { position:relative; z-index:1; min-height:100vh; display:flex; align-items:center; justify-content:center; padding:40px 20px; }
.LoginBox { width:100%; max-width:440px; background:rgba(15,31,61,.88); backdrop-filter:blur(14px); border:1px solid rgba(26,111,212,.3); border-radius:24px; padding:48px 40px; animation:fadeUp .6s ease both; }
.LoginHead { text-align:center; margin-bottom:32px; }
.LoginLogo { font-family:'Bebas Neue',sans-serif; font-size:30px; letter-spacing:4px; color:#fff; }
.LoginLogo span { color:#00d4ff; }
.LoginRole { display:inline-block; background:rgba(255,152,0,.15); border:1px solid rgba(255,152,0,.4); color:#ff9800; font-family:'Rajdhani',sans-serif; font-size:11px; font-weight:700; letter-spacing:3px; text-transform:uppercase; padding:4px 14px; border-radius:20px; margin-top:8px; }
.LoginTitle { font-family:'Bebas Neue',sans-serif; font-size:40px; letter-spacing:3px; color:#fff; margin:24px 0 4px; text-align:center; }
.LoginTitle span { color:#00d4ff; }
.LoginDiv { width:60px; height:3px; background:linear-gradient(90deg,#1a6fd4,#00d4ff); margin:12px auto 28px; border-radius:2px; }
.LForm { display:flex; flex-direction:column; gap:18px; }
.LGroup { display:flex; flex-direction:column; gap:8px; }
.LLabel { font-family:'Rajdhani',sans-serif; font-size:11px; font-weight:700; letter-spacing:2.5px; text-transform:uppercase; color:rgba(255,255,255,.4); }
.LInput { background:rgba(10,22,40,.8); border:1px solid rgba(26,111,212,.35); border-radius:12px; color:#fff; font-family:'Rajdhani',sans-serif; font-size:16px; padding:13px 16px; outline:none; transition:border-color .2s; }
.LInput:focus { border-color:#00d4ff; }
.LErr { background:rgba(255,68,68,.1); border:1px solid rgba(255,68,68,.3); color:#ff4444; padding:12px 16px; border-radius:10px; font-family:'Rajdhani',sans-serif; font-size:14px; font-weight:600; }
.LBtn { padding:15px; border-radius:14px; border:none; cursor:pointer; font-family:'Rajdhani',sans-serif; font-size:17px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#fff; background:linear-gradient(135deg,#1a6fd4,#2196f3); box-shadow:0 6px 24px rgba(33,150,243,.4); transition:all .22s; }
.LBtn:hover:not(:disabled){ transform:translateY(-2px); box-shadow:0 10px 32px rgba(33,150,243,.6); }
.LBtn:disabled { opacity:.6; cursor:not-allowed; }

/* ── Dashboard layout ── */
.ADash { position:relative; z-index:1; max-width:1300px; margin:0 auto; padding:36px 24px 80px; display:flex; flex-direction:column; gap:26px; }
.ATopBar { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:14px; }
.ADashTitle { font-family:'Bebas Neue',sans-serif; font-size:clamp(36px,5vw,58px); letter-spacing:3px; color:#fff; margin:0; text-shadow:0 0 40px rgba(33,150,243,.3); }
.ADashTitle span { color:#00d4ff; }
.ADashSub { font-family:'Rajdhani',sans-serif; font-size:13px; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:rgba(255,255,255,.3); margin:4px 0 0; }
.ALogout { padding:10px 22px; border-radius:10px; border:1px solid rgba(255,68,68,.3); background:rgba(255,68,68,.08); color:rgba(255,68,68,.8); font-family:'Rajdhani',sans-serif; font-size:13px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; cursor:pointer; transition:all .2s; }
.ALogout:hover { background:rgba(255,68,68,.18); color:#ff4444; }

/* Stats row */
.StatRow { display:grid; grid-template-columns:repeat(6,1fr); gap:14px; animation:fadeUp .6s .05s ease both; }
.Stat { background:rgba(15,31,61,.75); backdrop-filter:blur(14px); border:1px solid rgba(26,111,212,.2); border-radius:18px; padding:20px 14px; display:flex; flex-direction:column; align-items:center; gap:6px; transition:transform .25s,border-color .25s; }
.Stat:hover { transform:translateY(-3px); border-color:rgba(0,212,255,.35); }
.StatV { font-family:'Bebas Neue',sans-serif; font-size:38px; line-height:1; letter-spacing:1px; }
.StatL { font-family:'Rajdhani',sans-serif; font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:rgba(255,255,255,.3); text-align:center; }

/* Tabs */
.ATabs { display:flex; gap:8px; animation:fadeUp .6s .1s ease both; }
.ATab { padding:11px 22px; border-radius:10px; border:1px solid rgba(26,111,212,.2); background:rgba(10,22,40,.8); color:rgba(255,255,255,.4); font-family:'Rajdhani',sans-serif; font-size:13px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; cursor:pointer; transition:all .2s; display:flex; align-items:center; gap:8px; }
.ATab:hover { color:#fff; border-color:rgba(0,212,255,.3); }
.ATab.t-on { background:linear-gradient(135deg,#1a6fd4,#2196f3); color:#fff; border-color:#2196f3; box-shadow:0 4px 16px rgba(33,150,243,.3); }
.PBubble { background:#ff9800; color:#000; border-radius:50%; width:20px; height:20px; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; }

/* Panel card */
.ACard { background:rgba(15,31,61,.75); backdrop-filter:blur(14px); border:1px solid rgba(26,111,212,.2); border-radius:22px; padding:28px; animation:fadeUp .5s ease both; }
.ACardTitle { font-family:'Bebas Neue',sans-serif; font-size:26px; letter-spacing:2px; color:#fff; margin:0 0 22px; }

/* Filter row */
.AControls { display:flex; gap:12px; flex-wrap:wrap; margin-bottom:22px; align-items:center; }
.ASearch { background:rgba(10,22,40,.8); border:1px solid rgba(26,111,212,.3); border-radius:10px; color:#fff; font-family:'Rajdhani',sans-serif; font-size:14px; padding:9px 14px; outline:none; flex:1; min-width:200px; transition:border-color .2s; }
.ASearch:focus { border-color:#00d4ff; }
.FilBtns { display:flex; gap:6px; }
.FBt { padding:8px 16px; border-radius:8px; border:1px solid rgba(26,111,212,.2); background:rgba(10,22,40,.8); color:rgba(255,255,255,.4); font-family:'Rajdhani',sans-serif; font-size:12px; font-weight:700; letter-spacing:1px; text-transform:uppercase; cursor:pointer; transition:all .2s; }
.FBt:hover { color:#fff; border-color:rgba(0,212,255,.3); }
.FBt.f-on { background:rgba(0,212,255,.12); color:#00d4ff; border-color:rgba(0,212,255,.4); }

/* Request cards */
.ReqList { display:flex; flex-direction:column; gap:16px; }
.ReqCard { background:rgba(10,22,40,.6); border:1px solid rgba(26,111,212,.18); border-radius:16px; padding:20px 22px; display:grid; grid-template-columns:1fr auto; gap:18px; align-items:start; transition:border-color .2s; }
.ReqCard:hover { border-color:rgba(26,111,212,.38); }
.ReqCard.rq-pending  { border-left:3px solid #ff9800; }
.ReqCard.rq-approved { border-left:3px solid #00e676; }
.ReqCard.rq-rejected { border-left:3px solid #ff4444; }
.RLeft { display:flex; flex-direction:column; gap:10px; }
.RTop { display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
.RName  { font-family:'Bebas Neue',sans-serif; font-size:22px; letter-spacing:1.5px; color:#fff; }
.REmail { font-family:'Rajdhani',sans-serif; font-size:13px; color:rgba(255,255,255,.38); }
.RBadge { padding:3px 12px; border-radius:20px; font-family:'Rajdhani',sans-serif; font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; }
.rb-pending  { background:rgba(255,152,0,.12); color:#ff9800; border:1px solid rgba(255,152,0,.4); }
.rb-approved { background:rgba(0,230,118,.1);  color:#00e676; border:1px solid rgba(0,230,118,.3); }
.rb-rejected { background:rgba(255,68,68,.1);  color:#ff4444; border:1px solid rgba(255,68,68,.3); }
.RMeta { display:flex; gap:18px; flex-wrap:wrap; }
.RMetaI { font-family:'Rajdhani',sans-serif; font-size:12px; font-weight:600; color:rgba(255,255,255,.28); letter-spacing:.5px; }
.RMetaI span { color:rgba(255,255,255,.6); }
.RNote { font-family:'Inter',sans-serif; font-size:13px; font-weight:300; color:rgba(255,255,255,.42); line-height:1.55; background:rgba(255,255,255,.04); border-radius:8px; padding:8px 12px; }
.RRight { display:flex; flex-direction:column; gap:10px; align-items:flex-end; }
.RThumb { width:120px; height:88px; object-fit:cover; border-radius:10px; border:1px solid rgba(26,111,212,.3); cursor:pointer; transition:transform .2s,border-color .2s; }
.RThumb:hover { transform:scale(1.05); border-color:#00d4ff; }
.RBtns { display:flex; gap:8px; }
.RBtn { padding:8px 16px; border-radius:10px; border:none; cursor:pointer; font-family:'Rajdhani',sans-serif; font-size:13px; font-weight:700; letter-spacing:1px; text-transform:uppercase; transition:all .2s; white-space:nowrap; }
.rb-app { background:rgba(0,230,118,.15); color:#00e676; border:1px solid rgba(0,230,118,.35); }
.rb-app:hover { background:rgba(0,230,118,.25); }
.rb-rej { background:rgba(255,68,68,.12); color:#ff4444; border:1px solid rgba(255,68,68,.3); }
.rb-rej:hover { background:rgba(255,68,68,.22); }
.rb-rev { background:rgba(255,68,68,.1); color:rgba(255,68,68,.8); border:1px solid rgba(255,68,68,.25); font-size:12px; padding:7px 14px; }
.rb-grnt { background:rgba(0,212,255,.1); color:#00d4ff; border:1px solid rgba(0,212,255,.3); font-size:12px; padding:7px 14px; }

/* Screenshot modal */
.ImgModal { position:fixed; inset:0; background:rgba(0,0,0,.9); display:flex; align-items:center; justify-content:center; z-index:1000; padding:24px; cursor:pointer; }
.ImgModalImg { max-width:90vw; max-height:88vh; border-radius:14px; border:1px solid rgba(0,212,255,.3); box-shadow:0 0 60px rgba(0,0,0,.8); }
.ImgModalX { position:fixed; top:18px; right:24px; color:rgba(255,255,255,.6); font-size:32px; cursor:pointer; font-family:'Rajdhani',sans-serif; font-weight:700; z-index:1001; }

/* Users table */
.UTWrap { overflow-x:auto; }
.UTable { width:100%; border-collapse:collapse; }
.UTable thead tr { background:rgba(26,111,212,.1); border-bottom:1px solid rgba(26,111,212,.2); }
.UTable th { padding:12px 14px; font-family:'Rajdhani',sans-serif; font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#00d4ff; text-align:left; }
.UTable td { padding:13px 14px; font-family:'Rajdhani',sans-serif; font-size:14px; color:rgba(255,255,255,.75); vertical-align:middle; }
.UTable tbody tr { border-bottom:1px solid rgba(255,255,255,.04); transition:background .15s; }
.UTable tbody tr:hover { background:rgba(33,150,243,.05); }
.UTable tbody tr.upro { border-left:3px solid rgba(0,212,255,.4); }
.UPlan { padding:3px 12px; border-radius:20px; font-size:12px; font-weight:700; letter-spacing:.5px; display:inline-block; }
.up-pro  { background:rgba(0,212,255,.1); color:#00d4ff; border:1px solid rgba(0,212,255,.3); }
.up-free { background:rgba(255,255,255,.05); color:rgba(255,255,255,.3); border:1px solid rgba(255,255,255,.08); }

/* Grant form */
.GrantRow { display:flex; gap:12px; flex-wrap:wrap; padding:20px; background:rgba(10,22,40,.5); border:1px solid rgba(26,111,212,.2); border-radius:14px; margin-bottom:22px; }
.GInput { background:rgba(10,22,40,.8); border:1px solid rgba(26,111,212,.3); border-radius:10px; color:#fff; font-family:'Rajdhani',sans-serif; font-size:15px; padding:10px 14px; outline:none; flex:1; min-width:200px; transition:border-color .2s; }
.GInput:focus { border-color:#00d4ff; }
.GBtn { padding:10px 22px; border-radius:10px; border:none; cursor:pointer; font-family:'Rajdhani',sans-serif; font-size:14px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#fff; background:linear-gradient(135deg,#1a6fd4,#2196f3); box-shadow:0 4px 16px rgba(33,150,243,.35); transition:all .22s; }
.GBtn:hover:not(:disabled){ transform:translateY(-1px); }

/* Empty / loading */
.AEmpty { text-align:center; padding:50px; font-family:'Rajdhani',sans-serif; font-size:15px; color:rgba(255,255,255,.2); letter-spacing:1px; }
.ALoading { display:flex; flex-direction:column; align-items:center; gap:14px; padding:50px; color:rgba(255,255,255,.3); font-family:'Rajdhani',sans-serif; }
.Spin { width:34px; height:34px; border:3px solid rgba(26,111,212,.2); border-top-color:#00d4ff; border-radius:50%; animation:spin .75s linear infinite; }
.ANote { font-size:12px; color:rgba(0,212,255,.5); font-family:'Rajdhani',sans-serif; margin-top:8px; letter-spacing:.5px; }

/* Toast */
.Toast { position:fixed; top:20px; right:24px; z-index:999; background:rgba(15,31,61,.96); border:1px solid rgba(0,212,255,.4); border-radius:12px; padding:14px 22px; font-family:'Rajdhani',sans-serif; font-weight:700; font-size:15px; color:#fff; box-shadow:0 8px 32px rgba(0,0,0,.5); animation:fadeUp .3s ease both; }

@keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
@keyframes spin   { to{transform:rotate(360deg)} }
@media(max-width:1100px){ .StatRow{grid-template-columns:repeat(3,1fr)} }
@media(max-width:650px){ .StatRow{grid-template-columns:repeat(2,1fr)} .ADash{padding:24px 14px 60px} }
`;

const BASE = API_BASE_URL;

export default function AdminPanel() {
  /* ── Auth ── */
  const [token,    setToken]    = useState(() => localStorage.getItem('adminToken') || '');
  const [lEmail,   setLEmail]   = useState('zohaibadmin@gmail.com');
  const [lPass,    setLPass]    = useState('');
  const [lErr,     setLErr]     = useState('');
  const [logging,  setLogging]  = useState(false);

  /* ── Data ── */
  const [stats,    setStats]    = useState(null);
  const [requests, setRequests] = useState([]);
  const [users,    setUsers]    = useState([]);
  const [loading,  setLoading]  = useState(false);

  /* ── UI state ── */
  const [tab,        setTab]        = useState('requests');
  const [reqFilter,  setReqFilter]  = useState('pending');
  const [uSearch,    setUSearch]    = useState('');
  const [uFilter,    setUFilter]    = useState('All');
  const [imgModal,   setImgModal]   = useState(null);
  const [grantEmail, setGrantEmail] = useState('');
  const [busy,       setBusy]       = useState('');
  const [toast,      setToast]      = useState('');

  const hdrs = token ? { Authorization: `Bearer ${token}` } : {};

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3200); };

  /* ── Login ── */
  const doLogin = async () => {
    setLogging(true); setLErr('');
    try {
      const r = await axios.post(`${BASE}/api/payment/admin/login`, { email: lEmail, password: lPass });
      const t = r.data.token;
      setToken(t);
      localStorage.setItem('adminToken', t);
    } catch (err) {
      setLErr(err.response?.data?.message || 'Login failed');
    } finally { setLogging(false); }
  };

  const doLogout = () => { setToken(''); localStorage.removeItem('adminToken'); };

  /* ── Fetch all ── */
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [sR, rR, uR] = await Promise.all([
        axios.get(`${BASE}/api/payment/admin/stats`,    { headers: hdrs }),
        axios.get(`${BASE}/api/payment/admin/requests`, { headers: hdrs }),
        axios.get(`${BASE}/api/payment/admin/users`,    { headers: hdrs }),
      ]);
      setStats(sR.data);
      setRequests(rR.data.requests);
      setUsers(uR.data.users);
    } catch (err) {
      if (err.response?.status === 403 || err.response?.status === 401) doLogout();
    } finally { setLoading(false); }
  };

  useEffect(() => { if (token) fetchAll(); }, [token]);

  /* ── Actions ── */
  const approve = async (id) => {
    setBusy(id);
    try {
      await axios.post(`${BASE}/api/payment/admin/approve`, { requestId: id }, { headers: hdrs });
      showToast('✅ Pro activated!');
      fetchAll();
    } catch (err) { showToast('❌ ' + (err.response?.data?.message || 'Failed')); }
    finally { setBusy(''); }
  };

  const reject = async (id) => {
    const note = window.prompt('Reason for rejection (optional):') || '';
    setBusy(id + 'r');
    try {
      await axios.post(`${BASE}/api/payment/admin/reject`, { requestId: id, adminNote: note }, { headers: hdrs });
      showToast('Payment rejected.');
      fetchAll();
    } catch (err) { showToast('❌ ' + (err.response?.data?.message || 'Failed')); }
    finally { setBusy(''); }
  };

  const revoke = async (email) => {
    if (!window.confirm(`Revoke Pro from ${email}?`)) return;
    setBusy('rv' + email);
    try {
      await axios.post(`${BASE}/api/payment/admin/revoke-pro`, { targetEmail: email }, { headers: hdrs });
      showToast(`Pro revoked from ${email}`);
      fetchAll();
    } catch (err) { showToast('❌ ' + (err.response?.data?.message || 'Failed')); }
    finally { setBusy(''); }
  };

  const grant = async () => {
    if (!grantEmail) return;
    setBusy('grant');
    try {
      await axios.post(`${BASE}/api/payment/admin/grant-pro`, { targetEmail: grantEmail }, { headers: hdrs });
      showToast(`✅ Pro granted to ${grantEmail}`);
      setGrantEmail(''); fetchAll();
    } catch (err) { showToast('❌ ' + (err.response?.data?.message || 'Failed')); }
    finally { setBusy(''); }
  };

  /* ── Derived ── */
  const filtReqs  = requests.filter(r => reqFilter === 'all' ? true : r.status === reqFilter);
  const pendCount = requests.filter(r => r.status === 'pending').length;
  const filtUsers = users.filter(u => {
    const s = uSearch.toLowerCase();
    const matchS = u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s);
    const matchF = uFilter === 'All' || (uFilter === 'Pro' ? u.isPro : !u.isPro);
    return matchS && matchF;
  });

  const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });

  /* ══════════════════ LOGIN SCREEN ══════════════════ */
  if (!token) return (
    <>
      <style>{css}</style>
      <div className="APage">
        <div className="LoginWrap">
          <div className="LoginBox">
            <div className="LoginHead">
              <div className="LoginLogo">Sweat<span>&</span>Gain</div>
              <div className="LoginRole">Admin Portal</div>
            </div>
            <div className="LoginTitle">Admin <span>Login</span></div>
            <div className="LoginDiv" />
            <div className="LForm">
              <div className="LGroup">
                <label className="LLabel">Email</label>
                <input className="LInput" type="email" placeholder="admin@email.com"
                  value={lEmail} onChange={e => setLEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && doLogin()} />
              </div>
              <div className="LGroup">
                <label className="LLabel">Password</label>
                <input className="LInput" type="password" placeholder="••••••••"
                  value={lPass} onChange={e => setLPass(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && doLogin()} />
              </div>
              {lErr && <div className="LErr">{lErr}</div>}
              <button className="LBtn" onClick={doLogin} disabled={logging}>
                {logging ? 'Logging in...' : 'Login to Admin Panel'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  /* ══════════════════ DASHBOARD ══════════════════ */
  return (
    <>
      <style>{css}</style>
      <div className="APage">

        {/* Toast */}
        {toast && <div className="Toast">{toast}</div>}

        {/* Screenshot modal */}
        {imgModal && (
          <div className="ImgModal" onClick={() => setImgModal(null)}>
            <div className="ImgModalX" onClick={() => setImgModal(null)}>✕</div>
            <img className="ImgModalImg" src={imgModal} alt="Payment" onClick={e => e.stopPropagation()} />
          </div>
        )}

        <div className="ADash">
          {/* Top bar */}
          <div className="ATopBar">
            <div>
              <div className="ADashTitle">Admin <span>Panel</span></div>
              <div className="ADashSub">SweatAndGain — Payment & User Management</div>
            </div>
            <button className="ALogout" onClick={doLogout}>Logout</button>
          </div>

          {/* Stats */}
          {stats && (
            <div className="StatRow">
              {[
                { v: stats.totalUsers, l: 'Total Users', c: '#fff' },
                { v: stats.proUsers,   l: 'Pro Users',   c: '#00d4ff' },
                { v: stats.freeUsers,  l: 'Free Users',  c: 'rgba(255,255,255,.4)' },
                { v: stats.pending,    l: 'Pending',     c: '#ff9800' },
                { v: stats.approved,   l: 'Approved',    c: '#00e676' },
                { v: stats.rejected,   l: 'Rejected',    c: '#ff4444' },
              ].map((s, i) => (
                <div className="Stat" key={i}>
                  <span className="StatV" style={{ color: s.c }}>{s.v}</span>
                  <span className="StatL">{s.l}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tabs */}
          <div className="ATabs">
            <button className={`ATab ${tab === 'requests' ? 't-on' : ''}`} onClick={() => setTab('requests')}>
              Payment Requests
              {pendCount > 0 && <span className="PBubble">{pendCount}</span>}
            </button>
            <button className={`ATab ${tab === 'users' ? 't-on' : ''}`} onClick={() => setTab('users')}>
              Users
            </button>
          </div>

          {/* ──── Payment Requests Tab ──── */}
          {tab === 'requests' && (
            <div className="ACard">
              <div className="ACardTitle">Payment Requests</div>

              <div className="AControls">
                <div className="FilBtns">
                  {[
                    { k:'pending',  l:`⏳ Pending (${stats?.pending || 0})` },
                    { k:'approved', l:'✅ Approved' },
                    { k:'rejected', l:'❌ Rejected' },
                    { k:'all',      l:'All' },
                  ].map(f => (
                    <button key={f.k} className={`FBt ${reqFilter === f.k ? 'f-on' : ''}`} onClick={() => setReqFilter(f.k)}>{f.l}</button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div className="ALoading"><div className="Spin" /><p>Loading...</p></div>
              ) : filtReqs.length === 0 ? (
                <div className="AEmpty">No {reqFilter} requests found.</div>
              ) : (
                <div className="ReqList">
                  {filtReqs.map(r => (
                    <div key={r._id} className={`ReqCard rq-${r.status}`}>
                      <div className="RLeft">
                        <div className="RTop">
                          <div className="RName">{r.userName}</div>
                          <div className="REmail">{r.userEmail}</div>
                          <span className={`RBadge rb-${r.status}`}>{r.status}</span>
                        </div>
                        <div className="RMeta">
                          <div className="RMetaI">Submitted: <span>{fmtDate(r.createdAt)}</span></div>
                          {r.reviewedAt && <div className="RMetaI">Reviewed: <span>{fmtDate(r.reviewedAt)}</span></div>}
                        </div>
                        {r.transactionNote && (
                          <div className="RNote">📝 {r.transactionNote}</div>
                        )}
                        {r.adminNote && r.status !== 'pending' && (
                          <div className="RNote" style={{ color: r.status === 'approved' ? 'rgba(0,230,118,.7)' : 'rgba(255,68,68,.7)' }}>
                            Admin: {r.adminNote}
                          </div>
                        )}
                      </div>

                      <div className="RRight">
                        {r.screenshotPath && (
                          <img
                            className="RThumb"
                            src={`${BASE}/${r.screenshotPath}`}
                            alt="Screenshot"
                            onClick={() => setImgModal(`${BASE}/${r.screenshotPath}`)}
                          />
                        )}
                        {r.status === 'pending' && (
                          <div className="RBtns">
                            <button className="RBtn rb-app" onClick={() => approve(r._id)} disabled={busy === r._id}>
                              {busy === r._id ? '...' : '✅ Approve'}
                            </button>
                            <button className="RBtn rb-rej" onClick={() => reject(r._id)} disabled={busy === r._id + 'r'}>
                              {busy === r._id + 'r' ? '...' : '❌ Reject'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ──── Users Tab ──── */}
          {tab === 'users' && (
            <div className="ACard">
              <div className="ACardTitle">All Users</div>

              {/* Grant Pro */}
              <div className="GrantRow">
                <input className="GInput" type="email" placeholder="User email to grant Pro manually..."
                  value={grantEmail} onChange={e => setGrantEmail(e.target.value)} />
                <button className="GBtn" onClick={grant} disabled={busy === 'grant'}>
                  {busy === 'grant' ? 'Granting...' : '⚡ Grant Pro'}
                </button>
              </div>

              {/* Controls */}
              <div className="AControls">
                <input className="ASearch" type="text" placeholder="Search by name or email..."
                  value={uSearch} onChange={e => setUSearch(e.target.value)} />
                <div className="FilBtns">
                  {['All','Pro','Free'].map(f => (
                    <button key={f} className={`FBt ${uFilter === f ? 'f-on' : ''}`} onClick={() => setUFilter(f)}>{f}</button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div className="ALoading"><div className="Spin" /><p>Loading users...</p></div>
              ) : (
                <div className="UTWrap">
                  <table className="UTable">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Country</th>
                        <th>Plan</th>
                        <th>Joined</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtUsers.map(u => (
                        <tr key={u._id} className={u.isPro ? 'upro' : ''}>
                          <td style={{ fontWeight:600 }}>{u.name}</td>
                          <td style={{ color:'rgba(255,255,255,.42)', fontSize:13 }}>{u.email}</td>
                          <td>{u.country}</td>
                          <td><span className={`UPlan ${u.isPro ? 'up-pro' : 'up-free'}`}>{u.isPro ? '⭐ Pro' : 'Free'}</span></td>
                          <td style={{ color:'rgba(255,255,255,.28)', fontSize:12 }}>
                            {new Date(u.createdAt).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
                          </td>
                          <td>
                            {u.isPro
                              ? <button className="RBtn rb-rev" onClick={() => revoke(u.email)} disabled={busy === 'rv' + u.email}>
                                  {busy === 'rv' + u.email ? '...' : 'Revoke Pro'}
                                </button>
                              : <span style={{ color:'rgba(255,255,255,.15)' }}>—</span>
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filtUsers.length === 0 && <div className="AEmpty">No users match.</div>}
                  <div className="ANote">Showing {filtUsers.length} of {users.length} users</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
