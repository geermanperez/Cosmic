const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

function getToken() {
  return localStorage.getItem("maple_token");
}

function saveToken(token) {
  if (token) localStorage.setItem("maple_token", token);
  else localStorage.removeItem("maple_token");
}

async function request(path, options = {}) {
  const headers = options.headers || {};
  headers["Content-Type"] = headers["Content-Type"] || "application/json";

  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error(body?.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body;
}

export { API_URL, getToken, saveToken, request };
