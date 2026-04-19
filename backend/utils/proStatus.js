import User from '../models/user.js';

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export const getTrialEndDate = (startDate = new Date()) =>
  new Date(startDate.getTime() + (7 * DAY_IN_MS));

export const syncUserProStatus = async (user) => {
  if (!user || !user.isPro || !user.proExpiresAt) {
    return user;
  }

  if (user.proExpiresAt > new Date()) {
    return user;
  }

  user.isPro = false;
  user.proExpiresAt = null;
  user.proSource = null;
  await user.save();

  return user;
};

export const buildProStatus = (user) => {
  const expiresAt = user?.proExpiresAt ? new Date(user.proExpiresAt) : null;
  const remainingMs = expiresAt ? expiresAt.getTime() - Date.now() : 0;
  const trialDaysLeft = expiresAt
    ? Math.max(0, Math.ceil(remainingMs / DAY_IN_MS))
    : 0;

  return {
    isPro: Boolean(user?.isPro),
    proSource: user?.proSource || null,
    proActivatedAt: user?.proActivatedAt || null,
    proExpiresAt: user?.proExpiresAt || null,
    trialStartedAt: user?.trialStartedAt || null,
    trialUsed: Boolean(user?.trialUsed),
    trialDaysLeft: user?.proSource === 'trial' && user?.isPro ? trialDaysLeft : 0,
  };
};
