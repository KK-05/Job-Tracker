const pool = require('../db');

const NoteModel = {
  async create({ application_id, content }) {
    const result = await pool.query(
      `INSERT INTO notes (application_id, content)
       VALUES ($1, $2)
       RETURNING *`,
      [application_id, content]
    );
    return result.rows[0];
  },

  async findByApplication(application_id) {
    const result = await pool.query(
      `SELECT * FROM notes WHERE application_id = $1 ORDER BY created_at DESC`,
      [application_id]
    );
    return result.rows;
  },

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM notes WHERE id = $1 RETURNING id`,
      [id]
    );
    return result.rowCount > 0;
  },
};

module.exports = NoteModel;
