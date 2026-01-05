export async function api(path, options = {}) {
  const origin = window.location.origin;
  let inferredBase = origin;
  try {
    const urlObj = new URL(origin);
    if (urlObj.port === '3000') {
      inferredBase = `${urlObj.protocol}//${urlObj.hostname}:8000`;
    }
  } catch {
    inferredBase = origin;
  }
  const base = process.env.REACT_APP_API_BASE || window.__API_BASE__ || inferredBase;
  const url = /^https?:/i.test(path) ? path : `${base}${path}`;
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    let bodyText = '';
    try { bodyText = await res.text(); } catch {}
    let data = null;
    try { data = bodyText ? JSON.parse(bodyText) : null; } catch {}
    const err = new Error((data && (data.error || data.message)) || res.statusText || 'Request failed');
    err.status = res.status;
    err.body = data || bodyText;
    throw err;
  }
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  return res.text();
}

export default api;
