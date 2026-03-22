const router = require('express').Router();
const authMiddleware = require('../middleware/auth');
const { uploadResume, getResumes, updateParsedText, deleteResume } = require('../controllers/resumeController');

router.use(authMiddleware);

router.post('/upload', uploadResume);
router.get('/', getResumes);
router.put('/:id/parsed-text', updateParsedText);
router.delete('/:id', deleteResume);

module.exports = router;
