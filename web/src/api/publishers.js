import { apiGet } from "../fetch.js";

export function getPublishers() {
  return apiGet("publishers");
}
