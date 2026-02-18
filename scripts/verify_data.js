const { sequelize } = require('../config/db');
const Lead = require('../models/lead');
require('dotenv').config();

const verifyData = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to Supabase...');

        const leads = await Lead.findAll({
            limit: 5,
            order: [['created_at', 'DESC']]
        });

        console.log(`Found ${leads.length} leads in the database.`);
        if (leads.length > 0) {
            console.log('Latest Lead:', JSON.stringify(leads[0].toJSON(), null, 2));
        } else {
            console.log('No leads found. Try submitting a form first.');
        }

        process.exit();
    } catch (error) {
        console.error('Error verifying data:', error);
        process.exit(1);
    }
};

verifyData();
