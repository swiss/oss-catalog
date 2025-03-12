import { apiDelete, apiGet } from "../fetch.js";

export function getSoftwares() {
  return apiGet("software");
}

export function deleteSoftware(id) {
  return apiDelete(`software/${id}`);
}
