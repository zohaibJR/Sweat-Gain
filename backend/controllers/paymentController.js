import PaymentRequest from '../models/PaymentRequest.js';
import User from '../models/user.js';

// ── USER: Submit payment screenshot ──
export const submitPayment = async (req, res) => {
  try {
    const { email, transactionNote } = req.body;
    if (!req.file) return res.status(400).json({ message: "Screenshot required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isPro) return res.status(400).json({ message: "You are already a Pro member" });

    // Check if there's already a pending request
    const existing = await PaymentRequest.findOne({ user: user._id, status: 'pending' });
    if (existing) return res.status(400).json({ message: "You already have a pending payment request. Please wait for admin review." });

    const request = await PaymentRequest.create({
      user:            user._id,
      userName:        user.name,
      userEmail:       user.email,
      screenshotPath:  req.file.path,
      transactionNote: transactionNote || '',
      status:          'pending'
    });

    res.status(201).json({ message: "Payment request submitted successfully. Admin will review within 24 hours.", requestId: request._id });
  } catch (err) {
    console.error("Submit payment error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ── USER: Get own payment request status ──
export const getMyPaymentStatus = async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    const request = await PaymentRequest.findOne({ user: user._id }).sort({ createdAt: -1 });

    res.json({
      isPro:   user.isPro,
      request: request ? {
        _id:             request._id,
        status:          request.status,
        adminNote:       request.adminNote,
        transactionNote: request.transactionNote,
        createdAt:       request.createdAt,
        reviewedAt:      request.reviewedAt,
      } : null
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ── ADMIN: Get all payment requests ──
export const getAllPaymentRequests = async (req, res) => {
  try {
    const { status } = req.query; // optional filter: pending/approved/rejected
    const filter = status ? { status } : {};

    const requests = await PaymentRequest.find(filter)
      .sort({ createdAt: -1 })
      .populate('user', 'name email country isPro createdAt');

    res.json({ requests, total: requests.length });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ── ADMIN: Approve payment ──
export const approvePayment = async (req, res) => {
  try {
    const { requestId, adminNote } = req.body;

    const request = await PaymentRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.status !== 'pending') return res.status(400).json({ message: "Request already reviewed" });

    // Activate Pro for the user
    await User.findByIdAndUpdate(request.user, { isPro: true });

    await PaymentRequest.findByIdAndUpdate(requestId, {
      status:     'approved',
      adminNote:  adminNote || 'Payment verified. Pro activated!',
      reviewedAt: new Date()
    });

    res.json({ message: `Pro activated for ${request.userEmail}` });
  } catch (err) {
    console.error("Approve payment error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ── ADMIN: Reject payment ──
export const rejectPayment = async (req, res) => {
  try {
    const { requestId, adminNote } = req.body;

    const request = await PaymentRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.status !== 'pending') return res.status(400).json({ message: "Request already reviewed" });

    await PaymentRequest.findByIdAndUpdate(requestId, {
      status:     'rejected',
      adminNote:  adminNote || 'Payment could not be verified. Please resubmit.',
      reviewedAt: new Date()
    });

    res.json({ message: `Payment rejected for ${request.userEmail}` });
  } catch (err) {
    console.error("Reject payment error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ── ADMIN: Get stats ──
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers   = await User.countDocuments({ isAdmin: false });
    const proUsers     = await User.countDocuments({ isPro: true });
    const pending      = await PaymentRequest.countDocuments({ status: 'pending' });
    const approved     = await PaymentRequest.countDocuments({ status: 'approved' });
    const rejected     = await PaymentRequest.countDocuments({ status: 'rejected' });

    res.json({ totalUsers, proUsers, freeUsers: totalUsers - proUsers, pending, approved, rejected });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ── ADMIN: Get all users ──
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false }).select('-password').sort({ createdAt: -1 });
    res.json({ users, total: users.length });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ── ADMIN: Revoke Pro ──
export const revokePro = async (req, res) => {
  try {
    const { targetEmail } = req.body;
    const user = await User.findOne({ email: targetEmail.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });
    await User.findByIdAndUpdate(user._id, { isPro: false });
    res.json({ message: `Pro revoked from ${user.email}` });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ── ADMIN: Grant Pro manually ──
export const grantPro = async (req, res) => {
  try {
    const { targetEmail } = req.body;
    const user = await User.findOne({ email: targetEmail.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });
    await User.findByIdAndUpdate(user._id, { isPro: true });
    res.json({ message: `Pro granted to ${user.email}` });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};