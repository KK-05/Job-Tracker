const router = require('express').Router();
const { body } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validate');
const { analyzeResume, jobMatch } = require('../controllers/aiController');

router.use(authMiddleware);

router.post(
  '/analyze-resume',
  [body('resume_id').isUUID().withMessage('Valid resume_id is required')],
  validate,
  analyzeResume
);

router.post(
  '/job-match',
  [
    body('resume_id').isUUID().withMessage('Valid resume_id is required'),
    body('application_id').isUUID().withMessage('Valid application_id is required'),
  ],
  validate,
  jobMatch
);

module.exports = router;
