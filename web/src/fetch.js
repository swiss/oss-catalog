import { getPasetoV2Token } from "./paseto.js";

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
  const baseUrl = "http://localhost:3000/v1";
  const token = await getPasetoV2Token();
  const res = await fetch(`${baseUrl}/${path}`, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return res.json();
}
