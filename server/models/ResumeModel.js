const pool = require('../db');

const ResumeModel = {
  async create({ user_id, file_url, parsed_text }) {
    const result = await pool.query(
      `INSERT INTO resumes (user_id, file_url, parsed_text)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [user_id, file_url, parsed_text || null]
    );
    return result.rows[0];
  },

  async findByUser(user_id) {
    const result = await pool.query(
      `SELECT * FROM resumes WHERE user_id = $1 ORDER BY created_at DESC`,
      [user_id]
    );
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query(
      `SELECT * FROM resumes WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  },

  async updateParsedText(id, parsed_text) {
    const result = await pool.query(
      `UPDATE resumes SET parsed_text = $1 WHERE id = $2 RETURNING *`,
      [parsed_text, id]
    );
    return result.rows[0] || null;
  },

  async delete(id, user_id) {
    const result = await pool.query(
      `DELETE FROM resumes WHERE id = $1 AND user_id = $2 RETURNING id`,
      [id, user_id]
    );
    return result.rowCount > 0;
  },
};

module.exports = ResumeModel;
