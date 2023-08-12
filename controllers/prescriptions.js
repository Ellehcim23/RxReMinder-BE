const express = require('express');
const router = express.Router();
const passport = require('passport');
const { DateTime } = require('luxon');

// import the Prescription model
const { Prescription, Medication, Dose, User } = require('../models');

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

// GET prescriptions by User ID http://localhost:8000/prescriptions/users/64d3e808dd702ff791142439
router.get('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const prescriptions = await Prescription.find({ user: userId }).populate('medication');
        res.status(200).json(prescriptions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching prescriptions', error });
    }
});

// POST a new prescription
router.post('/new', passport.authenticate('jwt', { session: false }), async (req, res) => {
    // console.log('in new prescription route');
    try {
        const userId = req.user.id;
        const { medId, freq, time1, time2, quantity, startDate, endDate, notes, timezone } = req.body;
        // console.log(medId, freq, time1, time2, quantity, startDate, endDate, notes, timezone);

        let firstTime1, firstTime2;
        const dose1Times = [];
        const dose2Times = [];
        const numDays = DateTime.fromISO(endDate).diff(DateTime.fromISO(startDate), 'days').toObject().days;
        // console.log(numDays);

        firstTime1 = DateTime.fromISO(`${startDate}T${time1}-0${timezone}:00`);
        // console.log(firstTime1.toISO());
        if (freq === 'twice') firstTime2 = DateTime.fromISO(`${startDate}T${time2}-0${timezone}:00`);

        switch (freq) {
            case 'twice':
                for (let i = 0; i < numDays; i++) {
                    dose2Times.push(DateTime.fromISO(firstTime2).plus({ days: i }).toISO());
                }
            case 'once':
                for (let i = 0; i < numDays; i++) {
                    console.log(DateTime.fromISO(firstTime1).plus({ days: i }).toISO());
                    dose1Times.push(DateTime.fromISO(firstTime1).plus({ days: i }).toISO());
                }
                break;
            case 'alternate':
                for (let i = 0; i < numDays; i += 2) {
                    dose1Times.push(DateTime.fromISO(firstTime1).plus({ days: i }).toISO());
                }
                break;
            case 'weekly':
                for (let i = 0; i < numDays; i += 7) {
                    dose1Times.push(DateTime.fromISO(firstTime1).plus({ days: i }).toISO());
                }
                break;
        }
        // console.log(dose1Times);
        // console.log(dose2Times);

        // console.log('dose1Times', dose1Times);

        let user = await User.findById(userId);
        let med = await Medication.findById(medId);

        const newPrescription = new Prescription({
            user: user,
            medication: med,
            quantity: quantity,
            notes: notes,
        });
        user.prescriptions.push(newPrescription);
        await user.save();
        // console.log(newPrescription);


        for (let i = 0; i < dose1Times.length; i++) {
            // console.log(i);
            const newDose = new Dose({
                user: user,
                prescription: newPrescription,
                medication: med,
                time: dose1Times[i],
            });
            await newDose.save();
            newPrescription.doses.push(newDose);
            await newDose.save();
        }

        if (freq === 'twice') {
            for (let i = 0; i < dose2Times.length; i++) {
                const newDose = new Dose({
                    user: user,
                    prescription: newPrescription,
                    medication: med,
                    time: dose2Times[i],
                });
                await newDose.save();
                newPrescription.doses.push(newDose);
            }
        }

        const savedPrescription = await newPrescription.save();
        const lookupPrescription = await Prescription.findById(savedPrescription._id);

        res.status(201).json({ message: 'Prescription created successfully', prescription: lookupPrescription });
    } catch (error) {
        res.status(500).json({ message: 'Error creating prescription', error });
    }
});

// PUT/update a prescription
router.put('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
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
router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const deletedPrescription = await Prescription.findByIdAndDelete(req.params.id);

        if (!deletedPrescription) {
            res.status(404).json({ message: 'Prescription not found' });
        } else {
            const deletedDoses = [];

            // Delete all the doses associated with the prescription
            await Promise.all(deletedPrescription.doses.map(async doseId => {
                const deletedDose = await Dose.findByIdAndDelete(doseId);
                // You can perform additional operations with the deleted dose if needed
                deletedDoses.push(deletedDose);
            }));

            // Remove the prescription ID from the user's prescriptions array
            const deletedUser = await User.findByIdAndUpdate(
                deletedPrescription.user,
                { $pull: { prescriptions: deletedPrescription._id } },
                { new: true }
            );

            res.status(200).json({
                message: 'Prescription deleted successfully',
                prescription: deletedPrescription,
                deletedMedication: deletedMedication,
                deletedUser: deletedUser,
                deletedDoses: deletedDoses
            });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting prescription', error });
    }
});


module.exports = router;

