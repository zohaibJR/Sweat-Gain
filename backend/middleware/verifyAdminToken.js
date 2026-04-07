import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sweatandgain_admin_secret_2025';

const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) return res.status(401).json({ message: "Admin token required" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ message: "Not an admin" });
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired admin token" });
  }
};

export default verifyAdminToken;