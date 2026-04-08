import User from '../models/user.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import AuthCode from '../models/AuthCode.js';
import { sendEmail } from '../utils/email.js';

const OTP_EXPIRY_MINUTES = 10;
const RESET_EXPIRY_MINUTES = 30;

function normalizeEmail(email = '') {
  return email.toLowerCase().trim();
}

function generateOtp() {
  return `${Math.floor(100000 + Math.random() * 900000)}`;
}

function hashValue(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function getClientBaseUrl() {
  const origins = (process.env.CORS_ORIGIN || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return process.env.CLIENT_URL || origins[0] || 'http://localhost:5173';
}

async function sendSignupOtpEmail(email, otp, name) {
  await sendEmail({
    to: email,
    subject: 'Your SweatAndGain signup OTP',
    text: `Hi ${name}, your SweatAndGain signup OTP is ${otp}. It will expire in ${OTP_EXPIRY_MINUTES} minutes.`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
        <h2>SweatAndGain Signup Verification</h2>
        <p>Hi ${name},</p>
        <p>Your 6-digit OTP is:</p>
        <div style="font-size:28px;font-weight:700;letter-spacing:8px;margin:16px 0">${otp}</div>
        <p>This code will expire in ${OTP_EXPIRY_MINUTES} minutes.</p>
      </div>
    `,
  });
}

async function sendResetPasswordEmail(email, name, resetLink) {
  await sendEmail({
    to: email,
    subject: 'Reset your SweatAndGain password',
    text: `Hi ${name}, open this link to reset your password: ${resetLink}. This link expires in ${RESET_EXPIRY_MINUTES} minutes.`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
        <h2>Reset Your Password</h2>
        <p>Hi ${name},</p>
        <p>Click the button below to reset your password.</p>
        <p style="margin:24px 0">
          <a href="${resetLink}" style="background:#0f62fe;color:#fff;text-decoration:none;padding:12px 22px;border-radius:8px;display:inline-block">Reset Password</a>
        </p>
        <p>If the button does not work, copy this link into your browser:</p>
        <p>${resetLink}</p>
        <p>This link will expire in ${RESET_EXPIRY_MINUTES} minutes.</p>
      </div>
    `,
  });
}

export const requestSignupOtp = async (req, res) => {
  try {
    const { name, email, country, password } = req.body;

    if (!name || !email || !country || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const normalizedEmail = normalizeEmail(email);
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const otp = generateOtp();
    const hashedPassword = await bcrypt.hash(password, 10);
    const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await AuthCode.findOneAndUpdate(
      { email: normalizedEmail, purpose: 'signup' },
      {
        email: normalizedEmail,
        purpose: 'signup',
        otpHash: hashValue(otp),
        otpExpiresAt,
        resetTokenHash: null,
        resetTokenExpiresAt: null,
        signupData: {
          name: name.trim(),
          country: country.trim(),
          password: hashedPassword,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await sendSignupOtpEmail(normalizedEmail, otp, name.trim());

    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Signup OTP Error:', error);
    res.status(500).json({
      message: error.message === 'SMTP credentials are missing'
        ? 'Email service is not configured on the server'
        : 'Failed to send OTP',
    });
  }
};

// ------------------- SIGNUP -------------------
export const signupUser = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const normalizedEmail = normalizeEmail(email);
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const pendingSignup = await AuthCode.findOne({
      email: normalizedEmail,
      purpose: 'signup',
    });

    if (!pendingSignup || !pendingSignup.otpHash || !pendingSignup.otpExpiresAt) {
      return res.status(400).json({ message: 'Please request a new OTP' });
    }

    if (pendingSignup.otpExpiresAt.getTime() < Date.now()) {
      await AuthCode.deleteOne({ _id: pendingSignup._id });
      return res.status(400).json({ message: 'OTP expired. Please request a new one' });
    }

    if (pendingSignup.otpHash !== hashValue(otp.trim())) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    const newUser = new User({
      name: pendingSignup.signupData.name,
      email: normalizedEmail,
      country: pendingSignup.signupData.country,
      password: pendingSignup.signupData.password,
    });

    await newUser.save();
    await AuthCode.deleteOne({ _id: pendingSignup._id });
    res.status(201).json({ message: 'User created successfully' });

  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const normalizedEmail = normalizeEmail(req.body.email);

    if (!normalizedEmail) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(200).json({
        message: 'If this email is registered, a reset link has been sent',
      });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiresAt = new Date(Date.now() + RESET_EXPIRY_MINUTES * 60 * 1000);

    await AuthCode.findOneAndUpdate(
      { email: normalizedEmail, purpose: 'password_reset' },
      {
        email: normalizedEmail,
        purpose: 'password_reset',
        otpHash: null,
        otpExpiresAt: null,
        resetTokenHash: hashValue(rawToken),
        resetTokenExpiresAt,
        signupData: { name: '', country: '', password: '' },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const resetLink = `${getClientBaseUrl()}/reset-password?token=${rawToken}&email=${encodeURIComponent(normalizedEmail)}`;
    await sendResetPasswordEmail(normalizedEmail, user.name, resetLink);

    res.status(200).json({
      message: 'If this email is registered, a reset link has been sent',
    });
  } catch (error) {
    console.error('Password Reset Request Error:', error);
    res.status(500).json({
      message: error.message === 'SMTP credentials are missing'
        ? 'Email service is not configured on the server'
        : 'Failed to send reset email',
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, token, password } = req.body;

    if (!email || !token || !password) {
      return res.status(400).json({ message: 'Email, token and password are required' });
    }

    const normalizedEmail = normalizeEmail(email);
    const resetRequest = await AuthCode.findOne({
      email: normalizedEmail,
      purpose: 'password_reset',
    });

    if (
      !resetRequest ||
      !resetRequest.resetTokenHash ||
      !resetRequest.resetTokenExpiresAt ||
      resetRequest.resetTokenExpiresAt.getTime() < Date.now() ||
      resetRequest.resetTokenHash !== hashValue(token)
    ) {
      return res.status(400).json({ message: 'This reset link is invalid or expired' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      await AuthCode.deleteOne({ _id: resetRequest._id });
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = hashedPassword;
    await user.save();
    await AuthCode.deleteOne({ _id: resetRequest._id });

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ message: 'Failed to reset password' });
  }
};

// ------------------- LOGIN -------------------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({ success: true, user: { id: user._id, name: user.name, email: user.email, country: user.country, isPro: user.isPro } });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ------------------- LOGOUT -------------------
export const logoutUser = (req, res) => {
  try {
    return res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    console.error('Logout Error:', err);
    return res.status(500).json({ message: 'Logout failed' });
  }
};
