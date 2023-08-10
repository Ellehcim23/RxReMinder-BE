const express = require('express');
const router = express.Router();
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const passport = require('passport');
// const { JWT_SECRET } = process.env;

// import the Dose model
const { Dose } = require('../models/');

// middleware to protect all routes
// router.use(passport.authenticate('jwt', { session: false }));

// GET make a dose route to get all dose
router.get('/', async (req, res) => {
    try {
        const doses = await Dose.find();
        // res.header("Access-Control-Allow-Origin", "*");
        res.status(200).json(doses);
    } catch (error) {
        // res.header("Access-Control-Allow-Origin", "*");
        res.json({ message: 'There was an issue, please try again...' });
    }
});

// POST a new dose
router.post('/doses', async (req, res) => {
    try {
        const newDose = new Dose(req.body);
        const savedDose = await newDose.save();
        // res.header("Access-Control-Allow-Origin", "*");
        res.status(201).json(savedDose);
    } catch (error) {
        // res.header("Access-Control-Allow-Origin", "*");
        res.json({ message: 'There was an issue, please try again...' });
    }
});

// PUT/update a dose
router.put('/doses/:id', async (req, res) => {
    try {
        const updatedDose = await Dose.findByIdAndUpdate(req.params.id, req.body, { new: true });
        // res.header("Access-Control-Allow-Origin", "*");
        res.status(200).json(updatedDose);
    } catch (error) {
        // res.header("Access-Control-Allow-Origin", "*");
        res.json({ message: 'There was an issue, please try again...' });
    }
});

// DELETE a dose
router.delete('/doses/:id', async (req, res) => {
    try {
        const deletedDose = await Dose.findByIdAndDelete(req.params.id);
        // res.header("Access-Control-Allow-Origin", "*");
        res.status(200).json({ message: 'Dose deleted successfully', dose: deletedDose });
    } catch (error) {
        // res.header("Access-Control-Allow-Origin", "*");
        res.json({ message: 'There was an issue, please try again...' });
    }
});

module.exports = router;

