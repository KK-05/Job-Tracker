const ApplicationModel = require('../models/ApplicationModel');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

/**
 * POST /api/applications
 */
const createApplication = asyncHandler(async (req, res) => {
  const { company_name, role, status, job_description, applied_date } = req.body;

  const application = await ApplicationModel.create({
    user_id: req.user.id,
    company_name,
    role,
    status,
    job_description,
    applied_date,
  });

  res.status(201).json({ success: true, data: application });
});

/**
 * GET /api/applications
 */
const getApplications = asyncHandler(async (req, res) => {
  const { status, sort, order, limit, offset } = req.query;

  const applications = await ApplicationModel.findAllByUser(req.user.id, {
    status,
    sort,
    order,
    limit: limit ? parseInt(limit) : undefined,
    offset: offset ? parseInt(offset) : undefined,
  });

  res.json({ success: true, data: applications });
});

/**
 * GET /api/applications/:id
 */
const getApplication = asyncHandler(async (req, res) => {
  const application = await ApplicationModel.findByIdAndUser(req.params.id, req.user.id);
  if (!application) {
    throw ApiError.notFound('Application not found');
  }

  res.json({ success: true, data: application });
});

/**
 * PUT /api/applications/:id
 */
const updateApplication = asyncHandler(async (req, res) => {
  const { company_name, role, status, job_description, applied_date } = req.body;

  const application = await ApplicationModel.update(req.params.id, req.user.id, {
    company_name,
    role,
    status,
    job_description,
    applied_date,
  });

  if (!application) {
    throw ApiError.notFound('Application not found');
  }

  res.json({ success: true, data: application });
});

/**
 * DELETE /api/applications/:id
 */
const deleteApplication = asyncHandler(async (req, res) => {
  const deleted = await ApplicationModel.delete(req.params.id, req.user.id);
  if (!deleted) {
    throw ApiError.notFound('Application not found');
  }

  res.json({ success: true, message: 'Application deleted' });
});

/**
 * GET /api/applications/analytics/summary
 */
const getAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const [statusCounts, monthly, total] = await Promise.all([
    ApplicationModel.getStatusCounts(userId),
    ApplicationModel.getMonthlyApplications(userId),
    ApplicationModel.getTotalCount(userId),
  ]);

  const countByStatus = {};
  statusCounts.forEach((s) => {
    countByStatus[s.status] = s.count;
  });

  const interviewCount = countByStatus['Interview'] || 0;
  const offerCount = countByStatus['Offer'] || 0;
  const rejectionCount = countByStatus['Rejected'] || 0;

  res.json({
    success: true,
    data: {
      total_applications: total,
      interview_count: interviewCount,
      offer_count: offerCount,
      rejection_count: rejectionCount,
      interview_rate: total ? Math.round((interviewCount / total) * 100) : 0,
      offer_rate: total ? Math.round((offerCount / total) * 100) : 0,
      rejection_rate: total ? Math.round((rejectionCount / total) * 100) : 0,
      applications_per_month: monthly,
      status_distribution: statusCounts,
    },
  });
});

module.exports = {
  createApplication,
  getApplications,
  getApplication,
  updateApplication,
  deleteApplication,
  getAnalytics,
};
