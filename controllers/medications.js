// Imports
require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { JWT_SECRET } = process.env;

// import the Medication model
const { Medication } = require('../models');

// GET route for /medications
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    Medication.find({})
        .then(medications => {
            if (medications) {
                return res.json({ medications: medications });
            } else {
                return res.json({ message: 'No medications exists' });
            }
        })
        .catch(error => {
            console.log('error', error);
            return res.json({ message: 'this is an issue, please try again' });
        });
});



module.exports = router;