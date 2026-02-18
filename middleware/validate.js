const validateLead = (req, res, next) => {
    const { name, email, phone, course, college, year } = req.body;

    if (!name || !email || !phone || !course || !college || !year) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    next();
};

module.exports = { validateLead };
