import { db, uuid, nowIso } from "../index.js";

/**
 * List submissions for a specific form
 * @param {string} formId - Form ID
 * @returns {Promise<Array>} Array of submissions with parsed payloads
 */
export async function listByForm(formId) {
  const submissions = await db.all(
    `SELECT id, formId, payload, status, createdAt, updatedAt
     FROM submissions
     WHERE formId = ?
     ORDER BY createdAt DESC`,
    formId
  );

  return submissions.map((submission) => ({
    ...submission,
    payload: JSON.parse(submission.payload),
  }));
}

/**
 * Create a new submission
 * @param {string} formId - Form ID
 * @param {Object} payload - Submission payload
 * @returns {Promise<Object>} Created submission with parsed payload
 */
export async function createSubmission(formId, payload) {
  const id = uuid();
  const now = nowIso();

  await db.run(
    `INSERT INTO submissions (id, formId, payload, status, createdAt, updatedAt)
     VALUES (?, ?, ?, 'pending', ?, ?)`,
    id,
    formId,
    JSON.stringify(payload),
    now,
    now
  );

  const submission = await db.get("SELECT * FROM submissions WHERE id = ?", id);

  return {
    ...submission,
    payload: JSON.parse(submission.payload),
  };
}

/**
 * Get a submission by ID
 * @param {string} id - Submission ID
 * @returns {Promise<Object|null>} Submission with parsed payload or null if not found
 */
export async function getSubmission(id) {
  const submission = await db.get("SELECT * FROM submissions WHERE id = ?", id);

  if (!submission) {
    return null;
  }

  return {
    ...submission,
    payload: JSON.parse(submission.payload),
  };
}
