const multer = require('multer');
const ResumeModel = require('../models/ResumeModel');
const { uploadToCloudinary } = require('../services/cloudinaryService');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// Multer config: store in memory for Cloudinary stream upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ApiError(400, 'Only PDF and Word documents are allowed'), false);
    }
  },
});

/**
 * POST /api/resume/upload
 */
const uploadResume = [
  upload.single('resume'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw ApiError.badRequest('No file uploaded');
    }

    const { url } = await uploadToCloudinary(req.file.buffer, req.file.originalname);

    const resume = await ResumeModel.create({
      user_id: req.user.id,
      file_url: url,
      parsed_text: req.body.parsed_text || null,
    });

    res.status(201).json({ success: true, data: resume });
  }),
];

/**
 * GET /api/resume
 */
const getResumes = asyncHandler(async (req, res) => {
  const resumes = await ResumeModel.findByUser(req.user.id);
  res.json({ success: true, data: resumes });
});

/**
 * PUT /api/resume/:id/parsed-text
 */
const updateParsedText = asyncHandler(async (req, res) => {
  const { parsed_text } = req.body;
  if (!parsed_text) {
    throw ApiError.badRequest('parsed_text is required');
  }

  const resume = await ResumeModel.findById(req.params.id);
  if (!resume || resume.user_id !== req.user.id) {
    throw ApiError.notFound('Resume not found');
  }

  const updated = await ResumeModel.updateParsedText(req.params.id, parsed_text);
  res.json({ success: true, data: updated });
});

/**
 * DELETE /api/resume/:id
 */
const deleteResume = asyncHandler(async (req, res) => {
  const deleted = await ResumeModel.delete(req.params.id, req.user.id);
  if (!deleted) {
    throw ApiError.notFound('Resume not found');
  }
  res.json({ success: true, message: 'Resume deleted' });
});

module.exports = { uploadResume, getResumes, updateParsedText, deleteResume };
