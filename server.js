require('dotenv').config();
console.log('GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS);

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { connectDB, sequelize } = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Sync Models
// force: false ensures we don't drop tables if they exist
sequelize.sync({ force: false }).then(() => {
  console.log('Database Synced');
}).catch(err => {
  console.error('Failed to sync database:', err.message);
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/leads', require('./routes/leads'));
app.use('/api/auth', require('./routes/auth'));

// Health check root route
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'GlobalEd Lead Management API is running.' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
