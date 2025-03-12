import { getPasetoV2Token } from "./paseto.js";

const API_BASEURL = process.env.API_BASEURL ?? "http://localhost:3000/v1/";

export function apiGet(path) {
  return apiFetch("GET", path);
}

export function apiPost(path, body) {
  return apiFetch("POST", path, body);
}

export function apiDelete(path) {
  return apiFetch("DELETE", path);
}

async function apiFetch(method, path, body) {
  const token = await getPasetoV2Token();
  const res = await fetch(`${API_BASEURL}${path}`, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return res.json();
}
