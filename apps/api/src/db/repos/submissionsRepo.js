import { db, uuid, nowIso } from "../index.js";

/**
 * List submissions for a specific form
 * @param {string} formId - Form ID
 * @returns {Array} Array of submissions with parsed payloads
 */
export function listByForm(formId) {
  const stmt = db.prepare(`
    SELECT id, formId, payload, status, createdAt, updatedAt
    FROM submissions
    WHERE formId = ?
    ORDER BY createdAt DESC
  `);

  const submissions = stmt.all(formId);

  return submissions.map((submission) => ({
    ...submission,
    payload: JSON.parse(submission.payload),
  }));
}

/**
 * Create a new submission
 * @param {string} formId - Form ID
 * @param {Object} payload - Submission payload
 * @returns {Object} Created submission with parsed payload
 */
export function createSubmission(formId, payload) {
  const id = uuid();
  const now = nowIso();

  const stmt = db.prepare(`
    INSERT INTO submissions (id, formId, payload, status, createdAt, updatedAt)
    VALUES (?, ?, ?, 'pending', ?, ?)
  `);

  stmt.run(id, formId, JSON.stringify(payload), now, now);

  const getStmt = db.prepare("SELECT * FROM submissions WHERE id = ?");
  const submission = getStmt.get(id);

  return {
    ...submission,
    payload: JSON.parse(submission.payload),
  };
}

/**
 * Get a submission by ID
 * @param {string} id - Submission ID
 * @returns {Object|null} Submission with parsed payload or null if not found
 */
export function getSubmission(id) {
  const stmt = db.prepare("SELECT * FROM submissions WHERE id = ?");
  const submission = stmt.get(id);

  if (!submission) {
    return null;
  }

  return {
    ...submission,
    payload: JSON.parse(submission.payload),
  };
}
