import { db, uuid, nowIso } from "../index.js";

/**
 * List all forms with basic information
 * @returns {Promise<Array>} Array of forms
 */
export async function listForms() {
  return await db.all(`
    SELECT id, name, description, status, createdAt, updatedAt
    FROM forms
    ORDER BY createdAt DESC
  `);
}

/**
 * Create a new form
 * @param {Object} data - Form data
 * @param {string} data.name - Form name
 * @param {string} [data.description] - Form description
 * @returns {Promise<Object>} Created form
 */
export async function createForm({ name, description }) {
  const id = uuid();
  const now = nowIso();

  await db.run(
    `INSERT INTO forms (id, name, description, status, createdAt, updatedAt)
     VALUES (?, ?, ?, 'active', ?, ?)`,
    id,
    name,
    description || null,
    now,
    now
  );

  return await db.get("SELECT * FROM forms WHERE id = ?", id);
}

/**
 * Get a form by ID with its fields
 * @param {string} id - Form ID
 * @returns {Promise<Object|null>} Form with fields or null if not found
 */
export async function getForm(id) {
  const form = await db.get("SELECT * FROM forms WHERE id = ?", id);

  if (!form) {
    return null;
  }

  const fields = await db.all(
    `SELECT * FROM form_fields
     WHERE formId = ?
     ORDER BY ord ASC`,
    id
  );

  const processedFields = fields.map((field) => ({
    ...field,
    required: Boolean(field.required),
    config: field.config ? JSON.parse(field.config) : null,
  }));

  return {
    ...form,
    fields: processedFields,
  };
}

/**
 * Update a form's basic fields
 * @param {string} id - Form ID
 * @param {Object} patch - Fields to update
 * @returns {Promise<Object|null>} Updated form or null if not found
 */
export async function updateForm(id, patch) {
  const form = await db.get("SELECT * FROM forms WHERE id = ?", id);

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

  await db.run(
    `UPDATE forms
     SET ${updates.join(", ")}
     WHERE id = ?`,
    ...values
  );

  return await db.get("SELECT * FROM forms WHERE id = ?", id);
}

/**
 * Replace form schema (form + fields) in a transaction
 * @param {string} id - Form ID
 * @param {Object} data - Form data with fields
 * @param {string} data.name - Form name
 * @param {string} [data.description] - Form description
 * @param {string} [data.status] - Form status
 * @param {Array} data.fields - Array of fields
 * @returns {Promise<Object|null>} Updated form with fields or null if not found
 */
export async function replaceSchema(id, { name, description, status, fields }) {
  const form = await db.get("SELECT * FROM forms WHERE id = ?", id);

  if (!form) {
    return null;
  }

  try {
    // Begin transaction
    await db.exec("BEGIN TRANSACTION");

    // Update form
    const now = nowIso();
    await db.run(
      `UPDATE forms
       SET name = ?, description = ?, status = ?, updatedAt = ?
       WHERE id = ?`,
      name,
      description || null,
      status || form.status,
      now,
      id
    );

    // Delete existing fields
    await db.run("DELETE FROM form_fields WHERE formId = ?", id);

    // Insert new fields
    if (fields && fields.length > 0) {
      for (const field of fields) {
        await db.run(
          `INSERT INTO form_fields (id, formId, type, name, label, required, ord, config, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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

    // Commit transaction
    await db.exec("COMMIT");
  } catch (error) {
    // Rollback on error
    await db.exec("ROLLBACK");
    throw error;
  }

  return await getForm(id);
}

/**
 * Delete a form (cascades to fields and submissions)
 * @param {string} id - Form ID
 * @returns {Promise<boolean>} True if deleted, false if not found
 */
export async function deleteForm(id) {
  const form = await db.get("SELECT * FROM forms WHERE id = ?", id);

  if (!form) {
    return false;
  }

  await db.run("DELETE FROM forms WHERE id = ?", id);

  return true;
}
