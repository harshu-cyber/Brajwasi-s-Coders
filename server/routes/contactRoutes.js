const express = require('express');
const router = express.Router();
const { submitContact, getContacts, updateContactStatus } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/contact - Submit form (Public)
router.post('/', submitContact);

// GET /api/contact - Fetch all forms (Protected)
router.get('/', protect, getContacts);

// PUT /api/contact/:id - Update inquiry status (Protected)
router.put('/:id', protect, updateContactStatus);

module.exports = router;
