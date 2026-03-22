const pool = require('../db');

const UserModel = {
  async create({ name, email, password_hash }) {
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name, email, password_hash]
    );
    return result.rows[0];
  },

  async findByEmail(email) {
    const result = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    return result.rows[0] || null;
  },

  async findById(id) {
    const result = await pool.query(
      `SELECT id, name, email, created_at FROM users WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  },
};

module.exports = UserModel;
