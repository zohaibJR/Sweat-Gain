import express from 'express';
import upload from '../middleware/upload.js';
import verifyAdminToken from '../middleware/verifyAdminToken.js';
import {
  submitPayment,
  getMyPaymentStatus,
  getAllPaymentRequests,
  approvePayment,
  rejectPayment,
  getAdminStats,
  getAllUsers,
  revokePro,
  grantPro
} from '../controllers/paymentController.js';
import { adminLogin } from '../controllers/adminAuthController.js';

const router = express.Router();

// ── Admin auth ──
router.post('/admin/login', adminLogin);

// ── User routes ──
router.post('/submit',  upload.single('screenshot'), submitPayment);
router.get('/status',   getMyPaymentStatus);

// ── Admin protected routes ──
router.get('/admin/requests',        verifyAdminToken, getAllPaymentRequests);
router.post('/admin/approve',        verifyAdminToken, approvePayment);
router.post('/admin/reject',         verifyAdminToken, rejectPayment);
router.get('/admin/stats',           verifyAdminToken, getAdminStats);
router.get('/admin/users',           verifyAdminToken, getAllUsers);
router.post('/admin/revoke-pro',     verifyAdminToken, revokePro);
router.post('/admin/grant-pro',      verifyAdminToken, grantPro);

export default router;