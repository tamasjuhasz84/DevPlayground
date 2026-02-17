/**
 * Wraps async Express route handlers to automatically catch errors
 * and forward them to the error handling middleware
 *
 * @param {Function} fn - Async route handler function
 * @returns {Function} Express middleware function
 *
 * @example
 * router.get('/users', asyncHandler(async (req, res) => {
 *   const users = await getUsersFromDb();
 *   res.json({ ok: true, data: users });
 * }));
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
