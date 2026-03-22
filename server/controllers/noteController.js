const NoteModel = require('../models/NoteModel');
const ApplicationModel = require('../models/ApplicationModel');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

/**
 * POST /api/notes
 */
const createNote = asyncHandler(async (req, res) => {
  const { application_id, content } = req.body;

  // Verify the application belongs to the authenticated user
  const application = await ApplicationModel.findByIdAndUser(application_id, req.user.id);
  if (!application) {
    throw ApiError.notFound('Application not found');
  }

  const note = await NoteModel.create({ application_id, content });
  res.status(201).json({ success: true, data: note });
});

/**
 * GET /api/notes/:applicationId
 */
const getNotes = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;

  // Verify the application belongs to the authenticated user
  const application = await ApplicationModel.findByIdAndUser(applicationId, req.user.id);
  if (!application) {
    throw ApiError.notFound('Application not found');
  }

  const notes = await NoteModel.findByApplication(applicationId);
  res.json({ success: true, data: notes });
});

module.exports = { createNote, getNotes };
