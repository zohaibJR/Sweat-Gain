import jwt from 'jsonwebtoken';

const ADMIN_EMAIL    = process.env.ADMIN_EMAIL || 'zohaibadmin@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Zohaib@SnG';
const JWT_SECRET     = process.env.JWT_SECRET || 'sweatandgain_admin_secret_2025';

export const adminLogin = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  if (email.toLowerCase() !== ADMIN_EMAIL || password !== ADMIN_PASSWORD)
    return res.status(401).json({ message: "Invalid admin credentials" });

  const token = jwt.sign({ email: ADMIN_EMAIL, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });

  res.json({
    message: "Admin login successful",
    token,
    admin: { email: ADMIN_EMAIL, name: "Zohaib (Admin)" }
  });
};
