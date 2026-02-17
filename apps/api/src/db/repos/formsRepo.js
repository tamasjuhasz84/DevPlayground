import { db, uuid, nowIso } from "../index.js";

/**
 * List all forms with basic information
 * @returns {Array} Array of forms
 */
export function listForms() {
  const stmt = db.prepare(`
    SELECT id, name, description, status, createdAt, updatedAt
    FROM forms
    ORDER BY createdAt DESC
  `);

  return stmt.all();
}

/**
 * Create a new form
 * @param {Object} data - Form data
 * @param {string} data.name - Form name
 * @param {string} [data.description] - Form description
 * @returns {Object} Created form
 */
export function createForm({ name, description }) {
  const id = uuid();
  const now = nowIso();

  const stmt = db.prepare(`
    INSERT INTO forms (id, name, description, status, createdAt, updatedAt)
    VALUES (?, ?, ?, 'active', ?, ?)
  `);

  stmt.run(id, name, description || null, now, now);

  const getStmt = db.prepare("SELECT * FROM forms WHERE id = ?");
  return getStmt.get(id);
}

/**
 * Get a form by ID with its fields
 * @param {string} id - Form ID
 * @returns {Object|null} Form with fields or null if not found
 */
export function getForm(id) {
  const formStmt = db.prepare("SELECT * FROM forms WHERE id = ?");
  const form = formStmt.get(id);

  if (!form) {
    return null;
  }

  const fieldsStmt = db.prepare(`
    SELECT * FROM form_fields
    WHERE formId = ?
    ORDER BY ord ASC
  `);

  const fields = fieldsStmt.all(id).map((field) => ({
    ...field,
    required: Boolean(field.required),
    config: field.config ? JSON.parse(field.config) : null,
  }));

  return {
    ...form,
    fields,
  };
}

/**
 * Update a form's basic fields
 * @param {string} id - Form ID
 * @param {Object} patch - Fields to update
 * @returns {Object|null} Updated form or null if not found
 */
export function updateForm(id, patch) {
  const formStmt = db.prepare("SELECT * FROM forms WHERE id = ?");
  const form = formStmt.get(id);

  if (!form) {
    return null;
  }

  const updates = [];
  const values = [];

  if (patch.name !== undefined) {
    updates.push("name = ?");
    values.push(patch.name);
  }

  if (patch.description !== undefined) {
    updates.push("description = ?");
    values.push(patch.description);
  }

  if (patch.status !== undefined) {
    updates.push("status = ?");
    values.push(patch.status);
  }

  if (updates.length === 0) {
    return form;
  }

  updates.push("updatedAt = ?");
  values.push(nowIso());
  values.push(id);

  const stmt = db.prepare(`
    UPDATE forms
    SET ${updates.join(", ")}
    WHERE id = ?
  `);

  stmt.run(...values);

  return formStmt.get(id);
}

/**
 * Replace form schema (form + fields) in a transaction
 * @param {string} id - Form ID
 * @param {Object} data - Form data with fields
 * @param {string} data.name - Form name
 * @param {string} [data.description] - Form description
 * @param {string} [data.status] - Form status
 * @param {Array} data.fields - Array of fields
 * @returns {Object|null} Updated form with fields or null if not found
 */
export function replaceSchema(id, { name, description, status, fields }) {
  const formStmt = db.prepare("SELECT * FROM forms WHERE id = ?");
  const form = formStmt.get(id);

  if (!form) {
    return null;
  }

  const transaction = db.transaction(() => {
    // Update form
    const now = nowIso();
    const updateFormStmt = db.prepare(`
      UPDATE forms
      SET name = ?, description = ?, status = ?, updatedAt = ?
      WHERE id = ?
    `);
    updateFormStmt.run(name, description || null, status || form.status, now, id);

    // Delete existing fields
    const deleteFieldsStmt = db.prepare("DELETE FROM form_fields WHERE formId = ?");
    deleteFieldsStmt.run(id);

    // Insert new fields
    if (fields && fields.length > 0) {
      const insertFieldStmt = db.prepare(`
        INSERT INTO form_fields (id, formId, type, name, label, required, ord, config, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const field of fields) {
        insertFieldStmt.run(
          uuid(),
          id,
          field.type,
          field.name,
          field.label || null,
          field.required ? 1 : 0,
          field.ord !== undefined ? field.ord : 0,
          field.config ? JSON.stringify(field.config) : null,
          now,
          now
        );
      }
    }
  });

  transaction();

  return getForm(id);
}

/**
 * Delete a form (cascades to fields and submissions)
 * @param {string} id - Form ID
 * @returns {boolean} True if deleted, false if not found
 */
export function deleteForm(id) {
  const formStmt = db.prepare("SELECT * FROM forms WHERE id = ?");
  const form = formStmt.get(id);

  if (!form) {
    return false;
  }

  const stmt = db.prepare("DELETE FROM forms WHERE id = ?");
  stmt.run(id);

  return true;
}
