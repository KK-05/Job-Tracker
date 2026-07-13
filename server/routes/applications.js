const router = require('express').Router();
const { body, query } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createApplication,
  getApplications,
  getApplication,
  updateApplication,
  deleteApplication,
  getAnalytics,
  bulkUpdateStatus,
  bulkDelete,
} = require('../controllers/applicationController');

// All routes require authentication
router.use(authMiddleware);

// Analytics (must be before :id route)
router.get(
  '/analytics/summary',
  [query('range').optional().isIn(['3', '6', '12', 'all']).withMessage('range must be one of 3, 6, 12, all')],
  validate,
  getAnalytics
);

// Bulk actions (must be before :id routes — "bulk" would otherwise be
// parsed as an :id, especially for DELETE /bulk vs DELETE /:id)
router.put(
  '/bulk/status',
  [
    body('ids').isArray({ min: 1 }).withMessage('ids must be a non-empty array of UUIDs'),
    body('ids.*').isUUID().withMessage('Each id must be a valid UUID'),
    body('status')
      .isIn(['Applied', 'Interview', 'Offer', 'Rejected'])
      .withMessage('Status must be one of: Applied, Interview, Offer, Rejected'),
  ],
  validate,
  bulkUpdateStatus
);

router.delete(
  '/bulk',
  [
    body('ids').isArray({ min: 1 }).withMessage('ids must be a non-empty array of UUIDs'),
    body('ids.*').isUUID().withMessage('Each id must be a valid UUID'),
  ],
  validate,
  bulkDelete
);

router.post(
  '/',
  [
    body('company_name').trim().notEmpty().withMessage('Company name is required'),
    body('role').trim().notEmpty().withMessage('Role is required'),
    body('status')
      .optional()
      .isIn(['Applied', 'Interview', 'Offer', 'Rejected'])
      .withMessage('Status must be one of: Applied, Interview, Offer, Rejected'),
  ],
  validate,
  createApplication
);

router.get('/', getApplications);
router.get('/:id', getApplication);

router.put(
  '/:id',
  [
    body('company_name').optional().trim().notEmpty().withMessage('Company name cannot be empty'),
    body('role').optional().trim().notEmpty().withMessage('Role cannot be empty'),
    body('status')
      .optional()
      .isIn(['Applied', 'Interview', 'Offer', 'Rejected'])
      .withMessage('Invalid status'),
  ],
  validate,
  updateApplication
);

router.delete('/:id', deleteApplication);

module.exports = router;