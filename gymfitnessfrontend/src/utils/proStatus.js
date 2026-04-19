export function syncStoredProStatus(status) {
  if (typeof window === 'undefined') return;

  localStorage.setItem('isPro', status?.isPro ? 'true' : 'false');
}
