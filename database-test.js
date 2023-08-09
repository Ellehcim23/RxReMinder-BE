// get access to environment variables
require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const { createRandomUser } = require('./utils');

// import our models
const { User } = require('./models');

// connect to the database
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// create connection object
const db = mongoose.connection;

// once the database opens
db.once('open', () => {
    console.log('Connected to MongoDB Database: Mongoose App at HOST: ', db.host, 'PORT: ', db.port);
});

// if there is a database error
db.on('error', (err) => {
    console.log(`Database error: `, err);
});

