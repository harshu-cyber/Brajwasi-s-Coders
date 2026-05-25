const Contact = require('../models/Contact');

// @desc    Submit a new contact inquiry
// @route   POST /api/contact
// @access  Public
const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, error: 'Please enter all fields' });
    }

    const contact = await Contact.create({
      name,
      email,
      subject,
      message
    });

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully! We will contact you soon.',
      contact
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all contact inquiries (Dashboard leads)
// @route   GET /api/contact
// @access  Private (Admin/User Dashboard only)
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: contacts.length,
      contacts
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update contact inquiry status
// @route   PUT /api/contact/:id
// @access  Private
const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['new', 'in-progress', 'resolved'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid or missing status' });
    }

    let contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ success: false, error: 'Contact inquiry not found' });
    }

    contact.status = status;
    await contact.save();

    res.json({
      success: true,
      message: `Inquiry status updated to ${status}`,
      contact
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  submitContact,
  getContacts,
  updateContactStatus
};
