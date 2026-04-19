import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './Style/Records.css';
import { API_BASE_URL, apiUrl } from '../config/api';
import { syncStoredProStatus } from '../utils/proStatus';

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

const BASE = API_BASE_URL;

function BarChart({ data, color }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
      <div style={{ display:'flex', alignItems:'flex-end', gap:8, height:120 }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:5, height:'100%', justifyContent:'flex-end' }}>
            <span style={{ fontFamily:'Rajdhani,sans-serif', fontSize:11, color:'rgba(255,255,255,.4)', fontWeight:600 }}>{d.value || ''}</span>
            <div style={{
              width:'100%', borderRadius:'6px 6px 0 0',
              background: d.value > 0 ? color + 'cc' : 'rgba(255,255,255,.06)',
              height: d.value > 0 ? Math.max(8, (d.value / max) * 100) + '%' : '4px',
              transition:'height .5s ease', minHeight:4,
              boxShadow: d.value > 0 ? '0 0 12px ' + color + '55' : 'none'
            }} />
            <span style={{ fontFamily:'Rajdhani,sans-serif', fontSize:10, color:'rgba(255,255,255,.3)', fontWeight:600, letterSpacing:.5, textAlign:'center', lineHeight:1.2 }}>{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Records() {
  const email = localStorage.getItem('userEmail');
  const now   = new Date();
  const [isPro, setIsPro] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear,  setSelectedYear]  = useState(now.getFullYear());
  const [statusFilter,  setStatusFilter]  = useState('All');
  const [searchDate,    setSearchDate]    = useState('');
  const [records,       setRecords]       = useState([]);
  const [summary,       setSummary]       = useState(null);
  const [loading,       setLoading]       = useState(true);

  const [exRange,       setExRange]       = useState('7');
  const [exHistory,     setExHistory]     = useState([]);
  const [muscleStats,   setMuscleStats]   = useState([]);
  const [weeklySummary, setWeeklySummary] = useState([]);
  const [mostTrained,   setMostTrained]   = useState(null);
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [exLoading,     setExLoading]     = useState(false);

  const years = [];
  for (let y = 2024; y <= now.getFullYear(); y++) years.push(y);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        apiUrl('/api/attendance/monthly/records?email=' + email + '&month=' + selectedMonth + '&year=' + selectedYear)
      );
      setRecords(res.data.records);
      setSummary(res.data.summary);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [email, selectedMonth, selectedYear]);

  const fetchExerciseData = useCallback(async () => {
    if (!isPro) return;
    setExLoading(true);
    try {
      const [histRes, muscleRes, weeklyRes] = await Promise.all([
        axios.get(apiUrl('/api/exercises/history?email=' + email + '&days=' + exRange)),
        axios.get(apiUrl('/api/exercises/muscle-stats?email=' + email)),
        axios.get(apiUrl('/api/exercises/weekly?email=' + email)),
      ]);
      setExHistory(histRes.data);
      setMuscleStats(muscleRes.data.stats || []);
      setMostTrained(muscleRes.data.mostTrained);
      setTotalWorkouts(muscleRes.data.totalWorkouts || 0);
      setWeeklySummary(weeklyRes.data.summary || []);
    } catch (err) { console.error(err); }
    finally { setExLoading(false); }
  }, [email, isPro, exRange]);

  useEffect(() => {
    if (!email) return;

    axios.get(apiUrl(`/api/payment/status?email=${email}`))
      .then((res) => {
        setIsPro(res.data.isPro);
        syncStoredProStatus(res.data);
      })
      .catch(() => setIsPro(false));
  }, [email]);

  useEffect(() => { if (email) fetchRecords(); }, [fetchRecords]);
  useEffect(() => { if (email && isPro) fetchExerciseData(); }, [fetchExerciseData]);

  const filtered = records.filter(r => {
    const statusMatch = statusFilter === 'All' || r.status === statusFilter;
    const searchMatch = searchDate.trim() === '' ||
      r.formattedDate.toLowerCase().includes(searchDate.toLowerCase()) ||
      r.dayName.toLowerCase().includes(searchDate.toLowerCase());
    return statusMatch && searchMatch;
  });

  const attendanceRate = summary && summary.totalRecords > 0
    ? Math.round((summary.presentCount / summary.totalRecords) * 100) : 0;

  const isSunday = (d) => new Date(d).getDay() === 0;

  const exBarData     = exHistory.map(r => ({ label: r.formattedDate, value: r.exercises.length }));
  const muscleBarData = muscleStats.slice(0, 8).map(s => ({ label: s.name.slice(0, 5), value: s.count }));
  const weeklyBarData = weeklySummary.map(d => ({ label: d.day, value: d.exerciseCount }));

  const card = { background:'linear-gradient(135deg,rgba(15,31,61,.85),rgba(10,22,40,.9))', border:'1px solid rgba(26,111,212,.25)', borderRadius:18, padding:'26px 28px', marginBottom:20 };
  const cardTitle = { fontFamily:'Bebas Neue,sans-serif', fontSize:22, letterSpacing:2, color:'#fff', margin:'0 0 20px', display:'flex', alignItems:'center', gap:10 };
  const rangeBtn = (a) => ({ padding:'7px 18px', borderRadius:8, cursor:'pointer', fontFamily:'Rajdhani,sans-serif', fontSize:13, fontWeight:700, letterSpacing:1, textTransform:'uppercase', transition:'all .2s', border: a ? '1px solid #00d4ff' : '1px solid rgba(26,111,212,.25)', background: a ? 'rgba(0,212,255,.12)' : 'rgba(10,22,40,.8)', color: a ? '#00d4ff' : 'rgba(255,255,255,.4)' });
  const pill = (c) => ({ background: c + '15', border: '1px solid ' + c + '40', borderRadius:12, padding:'16px 20px', display:'flex', flexDirection:'column', alignItems:'center', gap:4, minWidth:100 });
  const bigNum = (c) => ({ fontFamily:'Bebas Neue,sans-serif', fontSize:34, color:c, lineHeight:1 });
  const pillLabel = { fontFamily:'Rajdhani,sans-serif', fontSize:11, fontWeight:700, letterSpacing:2, textTransform:'uppercase', color:'rgba(255,255,255,.35)' };
  const empty = { textAlign:'center', padding:'30px 0', color:'rgba(255,255,255,.2)', fontFamily:'Rajdhani,sans-serif', fontSize:15 };
  const subLabel = { fontSize:13, fontFamily:'Rajdhani,sans-serif', fontWeight:600, color:'rgba(255,255,255,.25)', letterSpacing:1, marginLeft:'auto' };

  return (
    <div className="RecordsPage">
      <div className="RecordsInner">

        <div className="RecordsHeader">
          <div className="RecordsBadge">Attendance History</div>
          <h1 className="RecordsTitle">Your <span>Records</span></h1>
          <div className="RecordsDivider" />
          <p className="RecordsSubtitle">Track every day, filter by month, search your history.</p>
        </div>

        <div className="RecordsControls">
          <div className="ControlGroup">
            <label>Month</label>
            <select value={selectedMonth} onChange={e => setSelectedMonth(parseInt(e.target.value))}>
              {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
            </select>
          </div>
          <div className="ControlGroup">
            <label>Year</label>
            <select value={selectedYear} onChange={e => setSelectedYear(parseInt(e.target.value))}>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="ControlGroup">
            <label>Status</label>
            <div className="FilterBtns">
              {['All','Present','Absent'].map(s => (
                <button key={s} className={"FilterBtn " + (statusFilter === s ? 'active-' + s.toLowerCase() : '')} onClick={() => setStatusFilter(s)}>{s}</button>
              ))}
            </div>
          </div>
          <div className="ControlGroup SearchGroup">
            <label>Search</label>
            <input type="text" placeholder="e.g. Monday, Feb, 2025..." value={searchDate} onChange={e => setSearchDate(e.target.value)} />
          </div>
        </div>

        {summary && (
          <div className="RecordsSummary">
            <div className="SummaryChip chip-total"><span className="ChipValue">{summary.totalRecords}</span><span className="ChipLabel">Days Logged</span></div>
            <div className="SummaryChip chip-present"><span className="ChipValue">{summary.presentCount}</span><span className="ChipLabel">Present</span></div>
            <div className="SummaryChip chip-absent"><span className="ChipValue">{summary.absentCount}</span><span className="ChipLabel">Absent</span></div>
            <div className="SummaryChip chip-rate"><span className="ChipValue">{attendanceRate}%</span><span className="ChipLabel">Attendance Rate</span></div>
          </div>
        )}

        {summary && (
          <div className="RateBarWrap">
            <div className="RateBarTrack"><div className="RateBarFill" style={{ width: attendanceRate + '%' }} /></div>
            <span className="RateBarLabel">{summary.month} {summary.year}</span>
          </div>
        )}

        <div className="SundayLegend">
          <span className="SundayDot" />
          <span>Sunday — Auto rest day (marked Present automatically)</span>
        </div>

        <div className="RecordsTableWrap">
          {loading ? (
            <div className="RecordsLoading"><div className="Spinner" /><p>Loading records...</p></div>
          ) : filtered.length === 0 ? (
            <div className="NoRecords"><span className="NoRecordsIcon">&#128205;</span><p>No records found for the selected filters.</p></div>
          ) : (
            <table className="RecordsTable">
              <thead><tr><th>#</th><th>Date &amp; Day</th><th>Weight</th><th>Status</th></tr></thead>
              <tbody>
                {filtered.map((r, i) => {
                  const sunday = isSunday(r.date);
                  return (
                    <tr key={r.date} className={sunday ? 'row-sunday' : r.status === 'Present' ? 'row-present' : 'row-absent'}>
                      <td className="RowNum">{i + 1}</td>
                      <td className="RowDateDay">
                        <span className={"RowDate " + (sunday ? 'sunday-date' : '')}>{r.formattedDate}</span>
                        <span className={"RowDay " + (sunday ? 'sunday-day' : '')}>{r.dayName}{sunday && <span className="SundayTag">REST DAY</span>}</span>
                      </td>
                      <td className="RowWeight">{r.weight}<span>kg</span></td>
                      <td>
                        {sunday ? <span className="StatusBadge badge-sunday">Rest Day</span>
                          : <span className={"StatusBadge badge-" + r.status.toLowerCase()}>{r.status === 'Present' ? 'Present' : 'Absent'}</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {!loading && filtered.length > 0 && (
          <p className="ResultCount">Showing <strong>{filtered.length}</strong> of <strong>{records.length}</strong> records</p>
        )}

        {/* ══════════ PRO EXERCISE ANALYTICS ══════════ */}
        {isPro ? (
          <div style={{ marginTop:56, animation:'fadeUp .7s .1s ease both' }}>

            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12, marginBottom:24 }}>
              <div>
                <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:'clamp(32px,5vw,52px)', letterSpacing:3, color:'#fff', lineHeight:1, textShadow:'0 0 40px rgba(0,212,255,.25)' }}>
                  Exercise <span style={{ color:'#00d4ff' }}>Analytics</span>
                </div>
                <div style={{ fontFamily:'Rajdhani,sans-serif', fontSize:13, fontWeight:600, letterSpacing:2, textTransform:'uppercase', color:'rgba(255,255,255,.3)', marginTop:4 }}>Pro members only</div>
              </div>
              <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'linear-gradient(135deg,rgba(0,212,255,.18),rgba(33,150,243,.1))', border:'1px solid rgba(0,212,255,.4)', color:'#00d4ff', fontFamily:'Rajdhani,sans-serif', fontSize:11, fontWeight:700, letterSpacing:3, textTransform:'uppercase', padding:'6px 16px', borderRadius:40 }}>
                STAR Pro Feature
              </div>
            </div>

            <div style={{ display:'flex', gap:8, marginBottom:24 }}>
              <button style={rangeBtn(exRange === '7')}  onClick={() => setExRange('7')}>Last 7 Days</button>
              <button style={rangeBtn(exRange === '30')} onClick={() => setExRange('30')}>Last 30 Days</button>
            </div>

            {exLoading ? (
              <div style={{ display:'flex', alignItems:'center', gap:14, padding:'40px 0', color:'rgba(255,255,255,.3)', fontFamily:'Rajdhani,sans-serif', fontSize:15 }}>
                <div className="Spinner" /> Loading exercise data...
              </div>
            ) : (
              <>
                <div style={{ display:'flex', gap:14, flexWrap:'wrap', marginBottom:20 }}>
                  <div style={pill('#00d4ff')}><span style={bigNum('#00d4ff')}>{totalWorkouts}</span><span style={pillLabel}>Workouts</span></div>
                  <div style={pill('#00e676')}><span style={bigNum('#00e676')}>{exHistory.length}</span><span style={pillLabel}>Sessions Logged</span></div>
                  {mostTrained && <div style={pill('#ff9800')}><span style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:22, color:'#ff9800', lineHeight:1, letterSpacing:1 }}>{mostTrained}</span><span style={pillLabel}>Most Trained</span></div>}
                </div>

                <div style={card}>
                  <div style={cardTitle}><span style={{ color:'#00d4ff' }}>[ ]</span> Exercises Per Day <span style={subLabel}>Last {exRange} days</span></div>
                  {exBarData.length === 0 ? <div style={empty}>No exercise sessions logged yet.</div> : <BarChart data={exBarData} color="#00d4ff" />}
                </div>

                <div style={card}>
                  <div style={cardTitle}><span style={{ color:'#00e676' }}>[W]</span> This Week's Workouts</div>
                  {weeklyBarData.length === 0 ? <div style={empty}>No workouts this week yet.</div> : (
                    <>
                      <BarChart data={weeklyBarData} color="#00e676" />
                      <div style={{ display:'flex', flexWrap:'wrap', gap:10, marginTop:20 }}>
                        {weeklySummary.map((d, i) => (
                          <div key={i} style={{ background: d.exercises.length > 0 ? 'rgba(0,230,118,.08)' : 'rgba(255,255,255,.04)', border: d.exercises.length > 0 ? '1px solid rgba(0,230,118,.25)' : '1px solid rgba(255,255,255,.07)', borderRadius:12, padding:'10px 14px', minWidth:90 }}>
                            <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:16, letterSpacing:1, color: d.exercises.length > 0 ? '#00e676' : 'rgba(255,255,255,.25)' }}>{d.day}</div>
                            {d.exercises.length > 0 ? (
                              <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginTop:6 }}>
                                {d.exercises.map((ex, j) => (
                                  <span key={j} style={{ background:'rgba(0,212,255,.1)', border:'1px solid rgba(0,212,255,.25)', color:'#00d4ff', fontSize:10, fontFamily:'Rajdhani,sans-serif', fontWeight:700, padding:'2px 7px', borderRadius:20 }}>{ex}</span>
                                ))}
                              </div>
                            ) : <div style={{ fontFamily:'Rajdhani,sans-serif', fontSize:11, color:'rgba(255,255,255,.2)', marginTop:4 }}>Rest</div>}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div style={card}>
                  <div style={cardTitle}><span style={{ color:'#ff9800' }}>[M]</span> Muscle Group Frequency <span style={subLabel}>Last 30 days</span></div>
                  {muscleBarData.every(d => d.value === 0) ? <div style={empty}>Start logging exercises to see your muscle group stats.</div> : (
                    <>
                      <BarChart data={muscleBarData} color="#ff9800" />
                      <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:20 }}>
                        {muscleStats.map((s, i) => (
                          <div key={i} style={{ display:'flex', alignItems:'center', gap:8, background: s.count > 0 ? 'rgba(255,152,0,.07)' : 'rgba(255,255,255,.03)', border: s.count > 0 ? '1px solid rgba(255,152,0,.2)' : '1px solid rgba(255,255,255,.06)', borderRadius:10, padding:'8px 14px' }}>
                            <span style={{ fontFamily:'Rajdhani,sans-serif', fontSize:14, fontWeight:700, color: s.count > 0 ? 'rgba(255,255,255,.8)' : 'rgba(255,255,255,.25)' }}>{s.name}</span>
                            <span style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:18, color: s.count > 0 ? '#ff9800' : 'rgba(255,255,255,.15)', lineHeight:1 }}>{s.count}x</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        ) : (
          <div style={{ marginTop:56, background:'linear-gradient(135deg,rgba(15,31,61,.8),rgba(10,22,40,.9))', border:'1px solid rgba(0,212,255,.2)', borderRadius:20, padding:'40px 32px', textAlign:'center', animation:'fadeUp .7s .3s ease both' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>⭐</div>
            <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:32, letterSpacing:3, color:'#fff', marginBottom:8 }}>Exercise Analytics — <span style={{ color:'#00d4ff' }}>Pro Feature</span></div>
            <p style={{ fontFamily:'Rajdhani,sans-serif', fontSize:15, fontWeight:500, color:'rgba(255,255,255,.45)', margin:'0 0 20px', lineHeight:1.6 }}>
              Upgrade to Pro to unlock bar charts, muscle group frequency,<br/>weekly workout summaries and more.
            </p>
            <a href="/pricing" style={{ display:'inline-block', padding:'12px 32px', borderRadius:12, background:'linear-gradient(135deg,#1a6fd4,#2196f3)', color:'#fff', fontFamily:'Rajdhani,sans-serif', fontSize:16, fontWeight:700, letterSpacing:2, textTransform:'uppercase', textDecoration:'none', boxShadow:'0 6px 24px rgba(33,150,243,.4)' }}>
              Upgrade to Pro
            </a>
          </div>
        )}

      </div>
    </div>
  );
}

export default Records;
