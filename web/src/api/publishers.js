import { apiDelete, apiGet, apiPost } from "../fetch.js";

export function getPublishers() {
  return apiGet("publishers");
}

export function createPublisher(publisher) {
  return apiPost("publishers", publisher);
}

export function deletePublisher(id) {
  return apiDelete(`publishers/${id}`);
}
