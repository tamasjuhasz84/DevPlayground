import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE ?? "http://localhost:3001";

const http = axios.create({
  baseURL,
  timeout: 15000,
});

function toErrorMessage(err) {
  const data = err?.response?.data;
  if (data?.error?.message) return data.error.message;
  if (typeof data?.message === "string") return data.message;
  return err?.message || "Unknown API error";
}

async function unwrap(promise) {
  try {
    const res = await promise;
    // várható: { ok:true, data: ... }
    return res.data?.data ?? res.data;
  } catch (err) {
    throw new Error(toErrorMessage(err), { cause: err });
  }
}

export function listForms() {
  return unwrap(http.get("/forms"));
}

export function createForm(payload) {
  return unwrap(http.post("/forms", payload));
}

export function getForm(id) {
  return unwrap(http.get(`/forms/${id}`));
}

export function saveFormSchema(id, payload) {
  return unwrap(http.put(`/forms/${id}/schema`, payload));
}

export function listSubmissions(formId) {
  return unwrap(http.get(`/forms/${formId}/submissions`));
}

export function createSubmission(formId, values) {
  return unwrap(http.post(`/forms/${formId}/submissions`, { payload: values }));
}

export function getSubmission(id) {
  return unwrap(http.get(`/submissions/${id}`));
}
