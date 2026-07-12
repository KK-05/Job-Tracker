const pool = require('../db');

const ResumeInsightModel = {
  async create({ resume_id, analysis }) {
    const result = await pool.query(
      `INSERT INTO resume_insights (resume_id, analysis)
       VALUES ($1, $2)
       RETURNING *`,
      [resume_id, JSON.stringify(analysis)]
    );
    return result.rows[0];
  },

  async findByResume(resume_id) {
    const result = await pool.query(
      `SELECT * FROM resume_insights WHERE resume_id = $1 ORDER BY created_at DESC`,
      [resume_id]
    );
    return result.rows;
  },
};

module.exports = ResumeInsightModel;