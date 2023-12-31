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
        res.status(500).json({ message: 'Error fetching prescriptions.', error });
    }
});

// GET prescriptions by User ID http://localhost:8000/prescriptions/user
router.get('/user', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const userId = req.user.id;
        const prescriptions = await Prescription.find({ user: userId }).populate('medication').populate('doses');

        for (let i = 0; i < prescriptions.length; i++) {
            let freq, startDate, endDate, time1, time2;

            let firstDose = DateTime.fromJSDate(prescriptions[i].doses[0].time);
            let secondDose = DateTime.fromJSDate(prescriptions[i].doses[1].time);
            let lastDose = DateTime.fromJSDate(prescriptions[i].doses[prescriptions[i].doses.length - 1].time);

            // calculate frequency
            let diff = secondDose.diff(firstDose, 'hours').toObject().hours;
            switch (diff) {
                case 24:
                    freq = 'once';
                    break;
                case 48:
                    freq = 'alternate';
                    break;
                case 168:
                    freq = 'weekly';
                    break;
                default:
                    freq = 'twice';
                    break;
            }

            // calculate start date
            startDate = firstDose.toFormat('yyyy-MM-dd');
            endDate = lastDose.toFormat('yyyy-MM-dd');
            
            // calculate dose time(s) of day
            time1 = firstDose.toFormat('hh:mm a');
            if (freq === 'twice') time2 = secondDose.toFormat('hh:mm a');

            prescriptions[i] = { prescription: prescriptions[i], freq, startDate, endDate, time1, time2 };
        }

        res.status(200).json(prescriptions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching prescriptions.', error });
    }
});

// GET a specific prescription by ID
router.get('/:id', async (req, res) => {
    try {
        const prescription = await Prescription.findById(req.params.id).populate('medication').populate('doses');
        if (!prescription) {
            res.status(404).json({ message: 'Prescription not found.' });
        } else {
            let freq, startDate, endDate, time1, time2;
            
            let firstDose = DateTime.fromJSDate(prescription.doses[0].time);
            let secondDose = DateTime.fromJSDate(prescription.doses[1].time);
            let lastDose = DateTime.fromJSDate(prescription.doses[prescription.doses.length - 1].time);
            
            // calculate frequency
            let diff = secondDose.diff(firstDose, 'hours').toObject().hours;
            switch (diff) {
                case 24:
                    freq = 'once';
                    break;
                case 48:
                    freq = 'alternate';
                    break;
                case 168:
                    freq = 'weekly';
                    break;
                default:
                    freq = 'twice';
                    break;
            }

            // calculate start date
            startDate = firstDose.toFormat('yyyy-MM-dd');
            endDate = lastDose.toFormat('yyyy-MM-dd');

            // calculate dose time(s) of day
            time1 = firstDose.toFormat('hh:mm a');
            if (freq === 'twice') time2 = secondDose.toFormat('hh:mm a');

            res.status(200).json({ prescription, freq, startDate, endDate, time1, time2 });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching prescription.', error });
    }
});

// POST a new prescription
router.post('/new', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const userId = req.user.id;
        const { medId, freq, time1, time2, quantity, startDate, endDate, notes, timezone } = req.body;

        let firstTime1, firstTime2;
        const dose1Times = [];
        const dose2Times = [];
        const numDays = DateTime.fromISO(endDate).diff(DateTime.fromISO(startDate), 'days').toObject().days;

        firstTime1 = DateTime.fromISO(`${startDate}T${time1}-0${timezone}:00`);
        if (freq === 'twice') firstTime2 = DateTime.fromISO(`${startDate}T${time2}-0${timezone}:00`);

        switch (freq) {
            case 'twice':
                for (let i = 0; i < numDays; i++) {
                    dose2Times.push(DateTime.fromISO(firstTime2).plus({ days: i }).toISO());
                }
            case 'once':
                for (let i = 0; i < numDays; i++) {
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


        for (let i = 0; i < dose1Times.length; i++) {
            const newDose = new Dose({
                user: user,
                prescription: newPrescription,
                medication: med,
                time: dose1Times[i],
            });
            await newDose.save();
            newPrescription.doses.push(newDose);

            if(freq === 'twice') {
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

        res.status(201).json({ message: 'Prescription created successfully.', prescription: lookupPrescription });
    } catch (error) {
        res.status(500).json({ message: 'Error creating prescription.', error });
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
            res.status(404).json({ message: 'Prescription not found.' });
        } else {
            res.status(200).json(updatedPrescription);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating prescription.', error });
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
            const user = await User.findByIdAndUpdate(
                deletedPrescription.user,
                { $pull: { prescriptions: deletedPrescription._id } },
                { new: true }
            );

            res.status(200).json({
                message: 'Prescription deleted successfully',
                prescription: deletedPrescription,
                user: user,
                deletedDoses: deletedDoses,
            });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting prescription.', error });
    }
});

module.exports = router;