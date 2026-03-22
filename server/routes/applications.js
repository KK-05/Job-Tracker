const router = require('express').Router();
const { body } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createApplication,
  getApplications,
  getApplication,
  updateApplication,
  deleteApplication,
  getAnalytics,
} = require('../controllers/applicationController');

// All routes require authentication
router.use(authMiddleware);

// Analytics (must be before :id route)
router.get('/analytics/summary', getAnalytics);

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
