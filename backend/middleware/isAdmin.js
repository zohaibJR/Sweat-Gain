import User from '../models/user.js';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'zohaibadmin@gmail.com';

const isAdmin = async (req, res, next) => {
  try {
    const email = req.query.adminEmail || req.body.adminEmail || req.headers['x-admin-email'];
    if (!email) return res.status(400).json({ message: "Admin email required" });
    if (email.toLowerCase() !== ADMIN_EMAIL) {
      return res.status(403).json({ message: "Admin access denied" });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export default isAdmin;
