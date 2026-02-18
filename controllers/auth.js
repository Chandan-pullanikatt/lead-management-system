const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@globaled.in';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check against env variables for simplicity as per requirements (or could use DB)
        // The requirements said "Admin Panel with JWT authentication... Admin login with password hashing".
        // I can stick to a simple single admin user defined in env or seed a user in DB.
        // Let's use env for the master admin for now, or check DB. 
        // Wait, the requirement implies handling users. Let's support DB based admin.

        // For this assessment, creating a seeding script for the admin might be best.
        // But for login logic:

        // 1. Hardcoded admin check (for bootstrapping)
        if (email === ADMIN_EMAIL) {
            const isMatch = await bcrypt.compare(password, await bcrypt.hash(ADMIN_PASSWORD, 10)); // This is silly, hashing on the fly to compare.
            // Better:
            // if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) ... but password should be hashed.

            // Let's assume we look up in DB.
        }

        // Implementing DB based auth
        const User = require('../models/user');
        let user = await User.findOne({ where: { email } });

        if (!user) {
            // Fallback for initial setup if DB is empty? No, better to provide a seed script.
            return res.status(400).json({ error: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
