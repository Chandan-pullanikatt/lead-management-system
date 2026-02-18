const { sequelize } = require('../config/db');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const createAdmin = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');

        // Ensure table exists
        await sequelize.sync();
        console.log('Database synced...');

        const email = process.env.ADMIN_EMAIL || 'admin@globaled.in';
        const password = process.env.ADMIN_PASSWORD || 'admin123';

        // Check if admin exists
        let user = await User.findOne({ where: { email } });

        if (user) {
            console.log('Admin user already exists.');
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            user = await User.create({
                name: 'Admin',
                email,
                password: hashedPassword
            });
            console.log('Admin user created successfully.');
        }

        process.exit();
    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
};

createAdmin();
