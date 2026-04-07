import User from '../models/user.js';

const isPro = async (req, res, next) => {
  try {
    const email = req.query.email || req.body.email;
    if (!email) return res.status(400).json({ message: "Email required" });
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.isPro) return res.status(403).json({ message: "Pro subscription required", requiresPro: true });
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export default isPro;