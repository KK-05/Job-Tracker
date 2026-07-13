const router = require('express').Router();
const authMiddleware = require('../middleware/auth');
const { uploadResume, getResumes, updateParsedText, updateLabel, deleteResume } = require('../controllers/resumeController');

router.use(authMiddleware);

router.post('/upload', uploadResume);
router.get('/', getResumes);
router.put('/:id/parsed-text', updateParsedText);
router.put('/:id/label', updateLabel);
router.delete('/:id', deleteResume);

module.exports = router;