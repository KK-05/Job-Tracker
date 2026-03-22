const AIService = require('../services/aiService');
const AIInsightModel = require('../models/AIInsightModel');
const ResumeModel = require('../models/ResumeModel');
const ApplicationModel = require('../models/ApplicationModel');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

/**
 * POST /api/ai/analyze-resume
 * Body: { resume_id: string }
 */
const analyzeResume = asyncHandler(async (req, res) => {
  const { resume_id } = req.body;
  if (!resume_id) {
    throw ApiError.badRequest('resume_id is required');
  }

  const resume = await ResumeModel.findById(resume_id);
  if (!resume || resume.user_id !== req.user.id) {
    throw ApiError.notFound('Resume not found');
  }
  if (!resume.parsed_text) {
    throw ApiError.badRequest('Resume has no parsed text. Please upload or set parsed_text first.');
  }

  const analysis = await AIService.analyzeResume(resume.parsed_text);

  res.json({ success: true, data: analysis });
});

/**
 * POST /api/ai/job-match
 * Body: { resume_id: string, application_id: string }
 */
const jobMatch = asyncHandler(async (req, res) => {
  const { resume_id, application_id } = req.body;

  if (!resume_id || !application_id) {
    throw ApiError.badRequest('resume_id and application_id are required');
  }

  const resume = await ResumeModel.findById(resume_id);
  if (!resume || resume.user_id !== req.user.id) {
    throw ApiError.notFound('Resume not found');
  }
  if (!resume.parsed_text) {
    throw ApiError.badRequest('Resume has no parsed text');
  }

  const application = await ApplicationModel.findByIdAndUser(application_id, req.user.id);
  if (!application) {
    throw ApiError.notFound('Application not found');
  }
  if (!application.job_description) {
    throw ApiError.badRequest('Application has no job description');
  }

  const matchResult = await AIService.matchJob(resume.parsed_text, application.job_description);

  // Persist the AI insight
  const insight = await AIInsightModel.create({
    application_id,
    match_score: matchResult.match_score,
    feedback: JSON.stringify(matchResult),
  });

  res.json({
    success: true,
    data: {
      ...matchResult,
      insight_id: insight.id,
    },
  });
});

module.exports = { analyzeResume, jobMatch };
