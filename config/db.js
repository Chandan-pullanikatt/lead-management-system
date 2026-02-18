const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: process.env.DB_SSL === 'true' ? {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    } : {}
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');
    } catch (err) {
        console.error('Error: ' + err);
    }
};

module.exports = { sequelize, connectDB };
