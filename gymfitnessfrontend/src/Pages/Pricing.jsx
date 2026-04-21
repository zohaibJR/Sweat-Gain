import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { apiUrl } from '../config/api';
import { syncStoredProStatus } from '../utils/proStatus';

const css = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');

.PPage { min-height:100vh; background:#0a1628; position:relative; overflow-x:hidden; }
.PPage::before {
  content:''; position:fixed; inset:0; pointer-events:none; z-index:0;
  background-image:
    linear-gradient(rgba(26,111,212,.07) 1px,transparent 1px),
    linear-gradient(90deg,rgba(26,111,212,.07) 1px,transparent 1px);
  background-size:60px 60px;
}
.PInner { position:relative; z-index:1; max-width:1020px; margin:0 auto; padding:60px 24px 80px; }

.PHdr  { text-align:center; margin-bottom:48px; animation:fadeUp .6s ease both; }
.PBadge { display:inline-block; background:linear-gradient(135deg,rgba(26,111,212,.3),rgba(0,212,255,.15)); border:1px solid rgba(0,212,255,.4); color:#00d4ff; font-family:'Rajdhani',sans-serif; font-size:12px; font-weight:700; letter-spacing:4px; text-transform:uppercase; padding:7px 22px; border-radius:40px; margin-bottom:22px; }
.PTitle { font-family:'Bebas Neue',sans-serif; font-size:clamp(48px,7vw,72px); letter-spacing:3px; color:#fff; margin:0; text-shadow:0 0 50px rgba(33,150,243,.3); }
.PTitle span { color:#00d4ff; }
.PDivLine { width:80px; height:3px; background:linear-gradient(90deg,#1a6fd4,#00d4ff); margin:18px auto; border-radius:2px; }
.PSub { font-family:'Inter',sans-serif; font-size:15px; font-weight:300; color:rgba(255,255,255,.55); margin:0; }

.SBanner { text-align:center; padding:14px 24px; border-radius:14px; font-family:'Rajdhani',sans-serif; font-size:15px; font-weight:600; letter-spacing:.5px; margin-bottom:32px; animation:fadeUp .5s ease both; }
.sb-pro { background:rgba(0,230,118,.1); border:1px solid rgba(0,230,118,.3); color:#00e676; }
.sb-trial { background:rgba(0,212,255,.08); border:1px solid rgba(0,212,255,.35); color:#00d4ff; }
.sb-pending { background:rgba(255,152,0,.1); border:1px solid rgba(255,152,0,.4); color:#ff9800; }
.sb-rejected { background:rgba(255,68,68,.1); border:1px solid rgba(255,68,68,.3); color:#ff4444; }

.PCards { display:grid; grid-template-columns:1fr 1fr; gap:24px; margin-bottom:50px; animation:fadeUp .6s .1s ease both; }
.PCard { position:relative; background:rgba(15,31,61,.8); backdrop-filter:blur(14px); border:1px solid rgba(26,111,212,.25); border-radius:24px; padding:36px 28px; display:flex; flex-direction:column; gap:16px; transition:transform .28s,border-color .28s,box-shadow .28s; }
.PCard:hover { transform:translateY(-4px); }
.PCard-pro { border-color:rgba(0,212,255,.45); box-shadow:0 0 40px rgba(0,212,255,.1); }
.PCard-pro:hover { box-shadow:0 0 60px rgba(0,212,255,.18); }
.PopTag { position:absolute; top:-14px; left:50%; transform:translateX(-50%); background:linear-gradient(135deg,#1a6fd4,#00d4ff); color:#fff; font-family:'Rajdhani',sans-serif; font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase; padding:5px 20px; border-radius:20px; white-space:nowrap; }
.CPlan { font-family:'Bebas Neue',sans-serif; font-size:30px; letter-spacing:3px; color:rgba(255,255,255,.4); }
.CPlan-pro { color:#00d4ff; }
.CPriceRow { display:flex; align-items:baseline; gap:6px; }
.CPriceAmt { font-family:'Bebas Neue',sans-serif; font-size:56px; letter-spacing:1px; color:#fff; line-height:1; }
.CPriceAmt-pro { color:#00d4ff; }
.CPricePer { font-family:'Rajdhani',sans-serif; font-size:13px; font-weight:600; color:rgba(255,255,255,.35); letter-spacing:1px; }
.CDesc { font-family:'Inter',sans-serif; font-size:13px; font-weight:300; color:rgba(255,255,255,.45); margin:0; line-height:1.65; }
.CDivide { height:1px; background:linear-gradient(90deg,rgba(26,111,212,.4),transparent); }
.CFeat { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:10px; flex:1; }
.CFeat li { font-family:'Rajdhani',sans-serif; font-size:14px; font-weight:500; letter-spacing:.3px; }
.f-yes { color:rgba(255,255,255,.82); }
.f-no  { color:rgba(255,255,255,.2); }
.CActions { display:flex; flex-direction:column; gap:12px; margin-top:auto; }
.CBtn { width:100%; padding:14px; border-radius:14px; border:none; cursor:pointer; font-family:'Rajdhani',sans-serif; font-size:16px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; transition:all .22s; }
.btn-curr { background:rgba(255,255,255,.06); color:rgba(255,255,255,.3); border:1px solid rgba(255,255,255,.1); cursor:default; }
.btn-upg { background:linear-gradient(135deg,#1a6fd4,#2196f3); color:#fff; box-shadow:0 6px 24px rgba(33,150,243,.4); }
.btn-upg:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 10px 32px rgba(33,150,243,.6); }
.btn-trial { background:linear-gradient(135deg,#00b8d4,#00d4ff); color:#04111f; box-shadow:0 6px 24px rgba(0,212,255,.35); }
.btn-trial:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 10px 32px rgba(0,212,255,.45); }
.btn-actv { background:rgba(0,230,118,.1); color:#00e676; border:1px solid rgba(0,230,118,.3); cursor:default; }
.btn-pend { background:rgba(255,152,0,.1); color:#ff9800; border:1px solid rgba(255,152,0,.3); cursor:default; }
.btn-used { background:rgba(255,255,255,.06); color:rgba(255,255,255,.4); border:1px solid rgba(255,255,255,.1); cursor:default; }
.TrialNote { margin:0; font-family:'Inter',sans-serif; font-size:12px; font-weight:300; color:rgba(255,255,255,.42); line-height:1.6; }

.HTPay { background:rgba(15,31,61,.8); backdrop-filter:blur(14px); border:1px solid rgba(0,212,255,.22); border-radius:24px; padding:36px; margin-bottom:40px; animation:fadeUp .6s .2s ease both; }
.HTTitle { font-family:'Bebas Neue',sans-serif; font-size:32px; letter-spacing:3px; color:#fff; margin:0 0 28px; }
.HTTitle span { color:#00d4ff; }
.Steps { display:flex; flex-direction:column; gap:18px; margin-bottom:32px; }
.Step { display:flex; align-items:flex-start; gap:16px; }
.StepN { width:38px; height:38px; min-width:38px; border-radius:50%; background:linear-gradient(135deg,#1a6fd4,#00d4ff); display:flex; align-items:center; justify-content:center; font-family:'Bebas Neue',sans-serif; font-size:18px; color:#fff; flex-shrink:0; }
.StepT { font-family:'Rajdhani',sans-serif; font-size:15px; font-weight:700; letter-spacing:.5px; color:#fff; margin-bottom:4px; }
.StepD { font-family:'Inter',sans-serif; font-size:13px; font-weight:300; color:rgba(255,255,255,.45); line-height:1.65; }

.SadaCard { background:linear-gradient(135deg,rgba(26,111,212,.2),rgba(0,212,255,.07)); border:1px solid rgba(0,212,255,.4); border-radius:18px; padding:24px 28px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:18px; margin-bottom:28px; }
.SadaLbl { font-family:'Rajdhani',sans-serif; font-size:11px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:rgba(0,212,255,.7); margin-bottom:6px; }
.SadaName { font-family:'Bebas Neue',sans-serif; font-size:28px; letter-spacing:2px; color:#fff; }
.SadaNumber { font-family:'Rajdhani',sans-serif; font-size:24px; font-weight:700; letter-spacing:2px; color:#00d4ff; margin-top:4px; }
.SadaAmtLbl { font-family:'Rajdhani',sans-serif; font-size:11px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:rgba(255,255,255,.3); margin-bottom:4px; text-align:right; }
.SadaAmtVal { font-family:'Bebas Neue',sans-serif; font-size:46px; color:#00e676; line-height:1; letter-spacing:1px; text-align:right; }
.SadaAmtSub { font-family:'Rajdhani',sans-serif; font-size:12px; font-weight:600; color:rgba(255,255,255,.25); letter-spacing:1px; text-align:right; }

.UpForm { display:flex; flex-direction:column; gap:18px; }
.UFGroup { display:flex; flex-direction:column; gap:8px; }
.UFLabel { font-family:'Rajdhani',sans-serif; font-size:11px; font-weight:700; letter-spacing:2.5px; text-transform:uppercase; color:rgba(255,255,255,.45); }
.UFInput { background:rgba(10,22,40,.8); border:1px solid rgba(26,111,212,.35); border-radius:12px; color:#fff; font-family:'Rajdhani',sans-serif; font-size:15px; padding:12px 16px; outline:none; transition:border-color .2s; width:100%; box-sizing:border-box; }
.UFInput:focus { border-color:#00d4ff; }
.FileZone { border:2px dashed rgba(0,212,255,.3); border-radius:14px; padding:28px 20px; text-align:center; cursor:pointer; transition:all .22s; background:rgba(0,212,255,.03); position:relative; }
.FileZone:hover { border-color:#00d4ff; background:rgba(0,212,255,.06); }
.FileZone.has-file { border-color:#00e676; background:rgba(0,230,118,.04); }
.FileZone input { position:absolute; inset:0; opacity:0; cursor:pointer; width:100%; height:100%; }
.FileIcon { font-size:38px; display:block; margin-bottom:10px; }
.FileTxt { font-family:'Rajdhani',sans-serif; font-size:14px; font-weight:600; color:rgba(255,255,255,.45); letter-spacing:.5px; }
.FileHint { font-family:'Inter',sans-serif; font-size:12px; font-weight:300; color:rgba(255,255,255,.2); margin-top:4px; }
.PreviewImg { max-width:100%; max-height:200px; border-radius:10px; border:1px solid rgba(0,230,118,.3); margin-top:12px; }
.FeedbackMsg { padding:13px 18px; border-radius:12px; font-family:'Rajdhani',sans-serif; font-size:15px; font-weight:600; letter-spacing:.5px; }
.msg-ok { background:rgba(0,230,118,.1); border:1px solid rgba(0,230,118,.3); color:#00e676; }
.msg-err { background:rgba(255,68,68,.1); border:1px solid rgba(255,68,68,.3); color:#ff4444; }
.SubBtn { width:100%; padding:15px; border-radius:14px; border:none; cursor:pointer; font-family:'Rajdhani',sans-serif; font-size:16px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#fff; background:linear-gradient(135deg,#1a6fd4,#2196f3); box-shadow:0 6px 24px rgba(33,150,243,.4); transition:all .22s; }
.SubBtn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 10px 32px rgba(33,150,243,.6); }
.SubBtn:disabled, .CBtn:disabled { opacity:.6; cursor:not-allowed; transform:none; box-shadow:none; }

.FAQ { animation:fadeUp .6s .3s ease both; }
.FAQTitle { font-family:'Bebas Neue',sans-serif; font-size:36px; letter-spacing:3px; color:#fff; text-align:center; margin-bottom:26px; }
.FAQGrid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.FAQItem { background:rgba(15,31,61,.6); border:1px solid rgba(26,111,212,.18); border-radius:16px; padding:20px 22px; transition:border-color .25s; }
.FAQItem:hover { border-color:rgba(0,212,255,.35); }
.FAQq { font-family:'Rajdhani',sans-serif; font-size:15px; font-weight:700; color:#00d4ff; margin-bottom:8px; }
.FAQa { font-family:'Inter',sans-serif; font-size:13px; font-weight:300; color:rgba(255,255,255,.5); line-height:1.65; }

@keyframes fadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
@media(max-width:700px){
  .PCards{grid-template-columns:1fr}
  .FAQGrid{grid-template-columns:1fr}
  .PInner{padding:40px 16px 60px}
  .SadaCard{flex-direction:column}
  .SadaAmtVal,.SadaAmtLbl,.SadaAmtSub{text-align:left}
}
`;

const FREE = [
  { t: 'Daily Attendance Tracking', y: true },
  { t: 'Weight Tracking', y: true },
  { t: 'Full History Access', y: true },
  { t: 'Basic Charts', y: true },
  { t: 'Exercise Tracking', y: false },
  { t: 'Workout Analytics', y: false },
  { t: 'Goal Setting', y: false },
  { t: 'Progress Reports', y: false },
];

const PRO = [
  { t: 'Everything in Free', y: true },
  { t: '7-Day Free Trial for New Users', y: true },
  { t: 'Exercise Selection per Day', y: true },
  { t: 'Muscle Group Tracking', y: true },
  { t: 'Advanced Progress Charts', y: true },
  { t: 'Workout Insights Dashboard', y: true },
  { t: 'Goal Setting and Tracking', y: true },
  { t: 'Progress Reports', y: true },
];

const formatDate = (value) => {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export default function Pricing() {
  const email = localStorage.getItem('userEmail');

  const [isPro, setIsPro] = useState(false);
  const [proSource, setProSource] = useState(null);
  const [proExpiresAt, setProExpiresAt] = useState(null);
  const [trialUsed, setTrialUsed] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState(0);
  const [payStatus, setPayStatus] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [trialStarting, setTrialStarting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const loadStatus = async () => {
    if (!email) return;

    const res = await axios.get(apiUrl(`/api/payment/status?email=${email}`));
    const data = res.data;

    setIsPro(data.isPro);
    setProSource(data.proSource || null);
    setProExpiresAt(data.proExpiresAt || null);
    setTrialUsed(Boolean(data.trialUsed));
    setTrialDaysLeft(data.trialDaysLeft || 0);
    setPayStatus(data.request?.status || null);
    syncStoredProStatus(data);
  };

  useEffect(() => {
    loadStatus().catch(console.error);
  }, [email]);

  const handleFile = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleStartTrial = async () => {
    if (!email) return;

    setTrialStarting(true);
    setFeedback(null);

    try {
      const res = await axios.post(apiUrl('/api/payment/trial/start'), { email });

      setIsPro(res.data.isPro);
      setProSource(res.data.proSource || null);
      setProExpiresAt(res.data.proExpiresAt || null);
      setTrialUsed(Boolean(res.data.trialUsed));
      setTrialDaysLeft(res.data.trialDaysLeft || 0);
      setPayStatus(null);
      syncStoredProStatus(res.data);
      setFeedback({
        ok: true,
        msg: `Your Pro trial is live for ${res.data.trialDaysLeft || 7} days.`
      });
    } catch (err) {
      setFeedback({
        ok: false,
        msg: err.response?.data?.message || 'Unable to start the trial right now.'
      });
    } finally {
      setTrialStarting(false);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setFeedback({ ok: false, msg: 'Please select a screenshot.' });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      const fd = new FormData();
      fd.append('email', email);
      fd.append('screenshot', file);
      fd.append('transactionNote', note);

      await axios.post(apiUrl('/api/payment/submit'), fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setFeedback({ ok: true, msg: 'Request submitted. Admin will review it within 24 hours.' });
      setPayStatus('pending');
      setShowUpload(false);
      setFile(null);
      setPreview(null);
      setNote('');
    } catch (err) {
      setFeedback({ ok: false, msg: err.response?.data?.message || 'Submission failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  const canUpload = !isPro && payStatus !== 'pending';
  const isTrialActive = isPro && proSource === 'trial';

  return (
    <>
      <style>{css}</style>
      <div className="PPage">
        <div className="PInner">
          <div className="PHdr">
            <div className="PBadge">Upgrade Your Grind</div>
            <h1 className="PTitle">Choose Your <span>Plan</span></h1>
            <div className="PDivLine" />
            <p className="PSub">Free keeps you on track. Pro unlocks every premium feature.</p>
          </div>

          {isTrialActive && (
            <div className="SBanner sb-trial">
              Your 7-day Pro trial is active. {trialDaysLeft} day{trialDaysLeft === 1 ? '' : 's'} left, ending on {formatDate(proExpiresAt)}.
            </div>
          )}
          {isPro && !isTrialActive && (
            <div className="SBanner sb-pro">You are on Pro. All premium features are unlocked.</div>
          )}
          {!isPro && payStatus === 'pending' && (
            <div className="SBanner sb-pending">Payment submitted and waiting for admin approval.</div>
          )}
          {!isPro && payStatus === 'rejected' && (
            <div className="SBanner sb-rejected">Your last payment was rejected. Please resubmit with a clear screenshot.</div>
          )}

          {feedback && (
            <div className={`FeedbackMsg ${feedback.ok ? 'msg-ok' : 'msg-err'}`} style={{ marginBottom: 24 }}>
              {feedback.msg}
            </div>
          )}

          <div className="PCards">
            <div className="PCard">
              <div className="CPlan">Free</div>
              <div className="CPriceRow">
                <span className="CPriceAmt">$0</span>
                <span className="CPricePer">/ forever</span>
              </div>
              <p className="CDesc">Perfect for attendance, weight tracking, and basic progress history.</p>
              <div className="CDivide" />
              <ul className="CFeat">
                {FREE.map((item, index) => (
                  <li key={index} className={item.y ? 'f-yes' : 'f-no'}>
                    {item.y ? 'OK' : 'NO'} {item.t}
                  </li>
                ))}
              </ul>
              <button className="CBtn btn-curr" disabled>Current Base Plan</button>
            </div>

            <div className="PCard PCard-pro">
              <div className="PopTag">Most Popular</div>
              <div className="CPlan CPlan-pro">Pro</div>
              <div className="CPriceRow">
                <span className="CPriceAmt CPriceAmt-pro">Rs 399</span>
                <span className="CPricePer">/ month</span>
              </div>
              <p className="CDesc">Advanced workout tracking, analytics, goals, and premium insights.</p>
              <div className="CDivide" />
              <ul className="CFeat">
                {PRO.map((item, index) => (
                  <li key={index} className="f-yes">OK {item.t}</li>
                ))}
              </ul>

              <div className="CActions">
                {isTrialActive && (
                  <button className="CBtn btn-actv" disabled>
                    Trial Active - {trialDaysLeft} Day{trialDaysLeft === 1 ? '' : 's'} Left
                  </button>
                )}
                {isPro && !isTrialActive && (
                  <button className="CBtn btn-actv" disabled>Active Plan</button>
                )}
                {!isPro && !trialUsed && (
                  <button className="CBtn btn-trial" onClick={handleStartTrial} disabled={trialStarting}>
                    {trialStarting ? 'Starting Trial...' : 'Start 7-Day Trial'}
                  </button>
                )}
                {!isPro && trialUsed && (
                  <button className="CBtn btn-used" disabled>7-Day Trial Already Used</button>
                )}
                {!isPro && payStatus === 'pending' && (
                  <button className="CBtn btn-pend" disabled>Pending Review</button>
                )}
                {!isPro && canUpload && (
                  <button className="CBtn btn-upg" onClick={() => setShowUpload(true)}>
                    Upgrade to Pro
                  </button>
                )}
                {!isPro && (
                  <p className="TrialNote">
                    New users can test Pro free for 7 days one time. After that, the trial ends automatically.
                  </p>
                )}
              </div>
            </div>
          </div>

          {!isPro && (
            <div className="HTPay">
              <div className="HTTitle">How to <span>Pay</span></div>

              <div className="Steps">
                {[
                  { n: 1, t: 'Send Payment via SadaPay', d: 'Send Rs 399 to the SadaPay account shown below.' },
                  { n: 2, t: 'Take a Screenshot', d: 'Capture a clear screenshot of the successful transaction.' },
                  { n: 3, t: 'Submit Your Screenshot', d: 'Click "Upgrade to Pro", upload the screenshot, and submit it.' },
                  { n: 4, t: 'Get Approved', d: 'Admin reviews your request and activates paid Pro access.' },
                ].map((step) => (
                  <div className="Step" key={step.n}>
                    <div className="StepN">{step.n}</div>
                    <div>
                      <div className="StepT">{step.t}</div>
                      <div className="StepD">{step.d}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="SadaCard">
                <div>
                  <div className="SadaLbl">SadaPay Account</div>
                  <div className="SadaName">Zohaib ur Rehman</div>
                  <div className="SadaNumber">0302-5422822</div>
                </div>
                <div>
                  <div className="SadaAmtLbl">Monthly Fee</div>
                  <div className="SadaAmtVal">399</div>
                  <div className="SadaAmtSub">PKR / month</div>
                </div>
              </div>

              {(showUpload || payStatus === 'rejected') && (
                <div className="UpForm">
                  <div className="UFGroup">
                    <label className="UFLabel">Transaction Note (optional)</label>
                    <input
                      className="UFInput"
                      type="text"
                      placeholder="e.g. Sent from SadaPay - TID: 12345"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </div>

                  <div className="UFGroup">
                    <label className="UFLabel">Payment Screenshot *</label>
                    <div className={`FileZone ${file ? 'has-file' : ''}`}>
                      <input type="file" accept="image/*" onChange={handleFile} />
                      {!preview ? (
                        <>
                          <span className="FileIcon">[+]</span>
                          <div className="FileTxt">Click to upload screenshot</div>
                          <div className="FileHint">JPG, PNG, WEBP - max 5MB</div>
                        </>
                      ) : (
                        <>
                          <div className="FileTxt" style={{ color: '#00e676' }}>{file?.name}</div>
                          <img src={preview} alt="preview" className="PreviewImg" />
                        </>
                      )}
                    </div>
                  </div>

                  <button className="SubBtn" onClick={handleSubmit} disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Payment'}
                  </button>
                </div>
              )}

              {!showUpload && canUpload && payStatus !== 'rejected' && (
                <button className="SubBtn" style={{ marginTop: 0 }} onClick={() => setShowUpload(true)}>
                  Upgrade to Pro - Rs 399/mo
                </button>
              )}
            </div>
          )}

          <div className="FAQ">
            <div className="FAQTitle">Common Questions</div>
            <div className="FAQGrid">
              {[
                { q: 'Can I test Pro before paying?', a: 'Yes. New users can activate one free 7-day Pro trial from this page.' },
                { q: 'What happens after 7 days?', a: 'The trial expires automatically and your account returns to the Free plan unless you upgrade.' },
                { q: 'How long does payment approval take?', a: 'Admin reviews payments within 24 hours, often sooner.' },
                { q: 'What if my payment is rejected?', a: 'You can upload a clearer screenshot and submit again.' },
              ].map((item, index) => (
                <div className="FAQItem" key={index}>
                  <div className="FAQq">{item.q}</div>
                  <div className="FAQa">{item.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
