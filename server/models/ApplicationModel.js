const pool = require('../db');

const ApplicationModel = {
  async create({ user_id, company_name, role, status, job_description, applied_date }) {
    const result = await pool.query(
      `INSERT INTO applications (user_id, company_name, role, status, job_description, applied_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [user_id, company_name, role, status || 'Applied', job_description, applied_date || new Date()]
    );
    return result.rows[0];
  },

  async findAllByUser(user_id, { status, sort = 'created_at', order = 'DESC', limit = 50, offset = 0 } = {}) {
    let query = `SELECT * FROM applications WHERE user_id = $1`;
    const params = [user_id];
    let paramIdx = 2;

    if (status) {
      query += ` AND status = $${paramIdx}`;
      params.push(status);
      paramIdx++;
    }

    const allowedSorts = ['created_at', 'applied_date', 'company_name', 'status'];
    const safeSort = allowedSorts.includes(sort) ? sort : 'created_at';
    const safeOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    query += ` ORDER BY ${safeSort} ${safeOrder} LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query(`SELECT * FROM applications WHERE id = $1`, [id]);
    return result.rows[0] || null;
  },

  async findByIdAndUser(id, user_id) {
    const result = await pool.query(
      `SELECT * FROM applications WHERE id = $1 AND user_id = $2`,
      [id, user_id]
    );
    return result.rows[0] || null;
  },

  async update(id, user_id, updates) {
    const fields = [];
    const values = [];
    let idx = 1;

    const allowed = ['company_name', 'role', 'status', 'job_description', 'applied_date'];
    for (const key of allowed) {
      if (updates[key] !== undefined) {
        fields.push(`${key} = $${idx}`);
        values.push(updates[key]);
        idx++;
      }
    }

    if (fields.length === 0) return null;

    values.push(id, user_id);
    const result = await pool.query(
      `UPDATE applications SET ${fields.join(', ')}
       WHERE id = $${idx} AND user_id = $${idx + 1}
       RETURNING *`,
      values
    );
    return result.rows[0] || null;
  },

  async delete(id, user_id) {
    const result = await pool.query(
      `DELETE FROM applications WHERE id = $1 AND user_id = $2 RETURNING id`,
      [id, user_id]
    );
    return result.rowCount > 0;
  },

  // ─── Analytics Queries ──────────────────────────────
  async getStatusCounts(user_id) {
    const result = await pool.query(
      `SELECT status, COUNT(*)::int as count
       FROM applications WHERE user_id = $1
       GROUP BY status`,
      [user_id]
    );
    return result.rows;
  },

  async getMonthlyApplications(user_id) {
    const result = await pool.query(
      `SELECT TO_CHAR(applied_date, 'YYYY-MM') as month, COUNT(*)::int as count
       FROM applications WHERE user_id = $1
       GROUP BY month
       ORDER BY month ASC
       LIMIT 12`,
      [user_id]
    );
    return result.rows;
  },

  async getTotalCount(user_id) {
    const result = await pool.query(
      `SELECT COUNT(*)::int as total FROM applications WHERE user_id = $1`,
      [user_id]
    );
    return result.rows[0].total;
  },
};

module.exports = ApplicationModel;
