import { apiGet } from "../fetch.js";

export function getSoftwares() {
  return apiGet("software");
}
