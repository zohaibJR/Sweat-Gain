import mongoose from 'mongoose';

const paymentRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName:     { type: String, required: true },
  userEmail:    { type: String, required: true },
  screenshotPath: { type: String, required: true },
  transactionNote: { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminNote: { type: String, default: '' },
  reviewedAt: { type: Date, default: null },
}, { timestamps: true });

export default mongoose.model('PaymentRequest', paymentRequestSchema);
