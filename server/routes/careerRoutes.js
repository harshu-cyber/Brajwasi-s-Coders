const express = require('express');
const router = express.Router();
const { submitApplication, getApplications, updateApplicationStatus } = require('../controllers/careerController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/career - Submit application (Public)
router.post('/', submitApplication);

// GET /api/career - Fetch all applications (Protected)
router.get('/', protect, getApplications);

// PUT /api/career/:id - Update application status (Protected)
router.put('/:id', protect, updateApplicationStatus);

module.exports = router;
