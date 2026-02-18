const Lead = require('../models/lead');
const { appendLeadToSheet, updateLeadInSheet } = require('../utils/googleSheets');

exports.createLead = async (req, res) => {
    try {
        const { name, email, phone, course, college, year } = req.body;

        // Check for existing lead by email
        const existingLead = await Lead.findOne({ where: { email } });
        if (existingLead) {
            return res.status(409).json({ error: 'Email already exists' });
        }

        const lead = await Lead.create({
            name,
            email,
            phone,
            course,
            college,
            year
        });

        // Google Sheets Integration
        // We do this asynchronously to not block the response, or await if critical.
        // For reliability, usually we queue this. Here we await to update the sheet_row_id.
        const rowId = await appendLeadToSheet(lead);
        if (rowId) {
            lead.sheet_row_id = rowId;
            await lead.save();
        }

        res.status(201).json({ message: 'Lead submitted successfully', lead });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getLeads = async (req, res) => {
    try {
        const leads = await Lead.findAll({ order: [['created_at', 'DESC']] });
        res.json(leads);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.updateLeadStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const lead = await Lead.findByPk(id);
        if (!lead) {
            return res.status(404).json({ error: 'Lead not found' });
        }

        lead.status = status;
        await lead.save();

        // Update Google Sheets
        if (lead.sheet_row_id) {
            await updateLeadInSheet(lead.sheet_row_id, status);
        }

        res.json({ message: 'Lead status updated', lead });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
