const rawBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, "");

export function apiUrl(path = "") {
  if (!path) return API_BASE_URL;
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
