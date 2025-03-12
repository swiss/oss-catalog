import { getPasetoV2Token } from "./paseto.js";

const API_BASEURL = process.env.API_BASEURL ?? "http://localhost:3000/v1/";

export function apiGet(path) {
  return apiFetch("GET", path);
}

export function apiPost(path, body) {
  return apiFetch("POST", path, body);
}

export function apiDelete(path) {
  return apiFetch("DELETE", path, undefined, { ignoreResponse: true });
}

async function apiFetch(method, path, body, options = {}) {
  const url = `${API_BASEURL}${path}`;
  console.log(`${method} ${url} ${body ? JSON.stringify(body) : ""}`);
  const token = await getPasetoV2Token();
  const res = await fetch(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!options.ignoreResponse) {
    return res.json();
  }
}
