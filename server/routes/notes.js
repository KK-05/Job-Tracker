const router = require('express').Router();
const { body } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createNote, getNotes } = require('../controllers/noteController');

router.use(authMiddleware);

router.post(
  '/',
  [
    body('application_id').isUUID().withMessage('Valid application_id is required'),
    body('content').trim().notEmpty().withMessage('Content is required'),
  ],
  validate,
  createNote
);

router.get('/:applicationId', getNotes);

module.exports = router;
