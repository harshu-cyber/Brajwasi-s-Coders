const Career = require('../models/Career');

// @desc    Submit a new career application
// @route   POST /api/career
// @access  Public
const submitApplication = async (req, res) => {
  try {
    const { name, email, phone, role, type, experience, resumeLink, message } = req.body;

    if (!name || !email || !phone || !role || !type || !experience || !resumeLink) {
      return res.status(400).json({ success: false, error: 'Please enter all required fields' });
    }

    const application = await Career.create({
      name,
      email,
      phone,
      role,
      type,
      experience,
      resumeLink,
      message
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! Our recruitment team will review it.',
      application
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all career applications (Dashboard list)
// @route   GET /api/career
// @access  Private (Admin Dashboard only)
const getApplications = async (req, res) => {
  try {
    const applications = await Career.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update career application status
// @route   PUT /api/career/:id
// @access  Private
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['new', 'reviewing', 'shortlisted', 'rejected', 'hired'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid or missing status' });
    }

    let application = await Career.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, error: 'Career application not found' });
    }

    application.status = status;
    await application.save();

    res.json({
      success: true,
      message: `Application status updated to ${status}`,
      application
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  submitApplication,
  getApplications,
  updateApplicationStatus
};
