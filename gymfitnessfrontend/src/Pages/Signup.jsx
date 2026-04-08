import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../Pages/PageAssets/LogoW.png';
import { apiUrl } from '../config/api';

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    password: "",
    password2: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  // Go to login page
  const goToLogin = () => navigate("/");

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Client-side validation
    if (!formData.name || !formData.email || !formData.country || !formData.password || !formData.password2) {
      setError("Please fill all fields");
      return;
    }

    if (formData.password !== formData.password2) {
      setError("Passwords do not match");
      return;
    }

    if (!otp.trim()) {
      setError("Please enter the OTP sent to your email");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(apiUrl("/api/users/signup"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp: otp.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Something went wrong");
      } else {
        alert("Signup successful!");
        navigate("/"); // redirect to login
      }

    } catch (err) {
      console.error(err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setError("");
    setMessage("");

    if (!formData.name || !formData.email || !formData.country || !formData.password || !formData.password2) {
      setError("Please fill all fields");
      return;
    }

    if (formData.password !== formData.password2) {
      setError("Passwords do not match");
      return;
    }

    setOtpLoading(true);
    try {
      const response = await fetch(apiUrl("/api/users/signup/request-otp"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          country: formData.country,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to send OTP");
        return;
      }

      setOtpSent(true);
      setMessage(data.message || "OTP sent to your email");
    } catch (err) {
      console.error(err);
      setError("Network error");
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className='LoginMainDiv'>
      <div className='InnerDiv'>
        {/* ── Left side (decorative / optional logo) ── */}
        <div className='LeftSide'>
          {/* <img src={Logo} alt="SweatAndGain Logo" className="leftLogo" /> */}
        </div>

        {/* ── Right side: Form + logo on top ── */}
        <div className="RightSide">
          <img src={Logo} alt="SweatAndGain Logo" className="rightLogo" />
          <h1>Sign Up</h1>

          {error && (
            <p style={{ color: "red", fontSize: 14, marginBottom: 10 }}>
              {error}
            </p>
          )}

          {message && (
            <p style={{ color: "#16a34a", fontSize: 14, marginBottom: 10 }}>
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit} className="InputFeilds">
            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Enter Email Address"
              value={formData.email}
              onChange={handleChange}
            />

            <input
              type="text"
              name="country"
              placeholder="Enter Country"
              value={formData.country}
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
            />

            <input
              type="password"
              name="password2"
              placeholder="Re Enter Password"
              value={formData.password2}
              onChange={handleChange}
            />

            {otpSent && (
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter 6 Digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              />
            )}

            {!otpSent && (
              <button type="button" onClick={handleSendOtp} disabled={otpLoading}>
                {otpLoading ? "Sending OTP..." : "Send OTP"}
              </button>
            )}

            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : otpSent ? "Verify OTP & Sign Up" : "Sign Up"}
            </button>
          </form>

          {otpSent && (
            <div className='SignUpText'>
              <h4>
                Didn&apos;t get the code?{" "}
                <a href="#" onClick={(e) => { e.preventDefault(); handleSendOtp(); }}>
                  Resend OTP
                </a>
              </h4>
            </div>
          )}

          <div className='SignUpText'>
            <h4>
              Already have an account?{" "}
              <a href="#" onClick={(e) => { e.preventDefault(); goToLogin(); }}>
                Login
              </a>
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
