const express = require('express');
const router = express.Router();

// import the Prescription model
const Prescription = require('../models').Prescription;

// GET all prescriptions
router.get('/', async (req, res) => {
    try {
        const prescriptions = await Prescription.find();
        res.status(200).json(prescriptions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching prescriptions', error });
    }
});

// GET a specific prescription by ID
router.get('/:id', async (req, res) => {
    try {
        const prescription = await Prescription.findById(req.params.id);
        if (!prescription) {
            res.status(404).json({ message: 'Prescription not found' });
        } else {
            res.status(200).json(prescription);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching prescription', error });
    }
});


// POST a new prescription
router.post('/new', async (req, res) => {
    try {
        const newPrescription = new Prescription(req.body);
        const savedPrescription = await newPrescription.save();
        res.status(201).json(savedPrescription);
    } catch (error) {
        res.status(500).json({ message: 'Error creating prescription', error });
    }
});

// PUT/update a prescription
router.put('/:id', async (req, res) => {
    try {
        const updatedPrescription = await Prescription.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedPrescription) {
            res.status(404).json({ message: 'Prescription not found' });
        } else {
            res.status(200).json(updatedPrescription);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating prescription', error });
    }
});

// DELETE a prescription
router.delete('/:id', async (req, res) => {
    try {
        const deletedPrescription = await Prescription.findByIdAndDelete(req.params.id);
        if (!deletedPrescription) {
            res.status(404).json({ message: 'Prescription not found' });
        } else {
            res.status(200).json({ message: 'Prescription deleted successfully', prescription: deletedPrescription });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting prescription', error });
    }
});


module.exports = router;

