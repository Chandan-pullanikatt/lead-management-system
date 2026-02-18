const express = require('express');
const router = express.Router();
const { createLead, getLeads, updateLeadStatus } = require('../controllers/leads');
const { validateLead } = require('../middleware/validate');
const auth = require('../middleware/auth');

// Public route to create a lead
router.post('/', validateLead, createLead);

// Protected routes
router.get('/', auth, getLeads);
router.put('/:id/status', auth, updateLeadStatus);

module.exports = router;
