const pool = require('../db');

const AIInsightModel = {
  async create({ application_id, match_score, feedback }) {
    const result = await pool.query(
      `INSERT INTO ai_insights (application_id, match_score, feedback)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [application_id, match_score, feedback]
    );
    return result.rows[0];
  },

  async findByApplication(application_id) {
    const result = await pool.query(
      `SELECT * FROM ai_insights WHERE application_id = $1 ORDER BY created_at DESC`,
      [application_id]
    );
    return result.rows;
  },

  async findLatestByApplication(application_id) {
    const result = await pool.query(
      `SELECT * FROM ai_insights WHERE application_id = $1
       ORDER BY created_at DESC LIMIT 1`,
      [application_id]
    );
    return result.rows[0] || null;
  },
};

module.exports = AIInsightModel;
