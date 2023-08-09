// seed the data with users
const { User, Medication, Prescription, Dose } = require('../models');
const { randIntInterval } = require('../utils');
const { DateTime } = require('luxon');

async function seedPrescriptions() {
    await Prescription.deleteMany({});
    await Dose.deleteMany({});

    // get all users
    let allUsers = await User.find({});

    // get all medications
    let allMeds = await Medication.find({});

    for (let user of allUsers) {
        // pick three random medication indices
        let randMedIndices = [randIntInterval(0, allMeds.length - 1), randIntInterval(0, allMeds.length - 1), randIntInterval(0, allMeds.length - 1)];

        // make new prescriptions for each of the three random medications
        for (let i = 0; i < randMedIndices.length; i++) {
            // create a new prescription
            let newPrescription = await Prescription.create({
                user: user,
                medication: allMeds[i],
                quantity: randIntInterval(1, 3),
                notes: 'Take with food.',
            });

            // set random time in the near future for first dose
            let firstDoseTime = DateTime.now().startOf('hour').plus({ hours: randIntInterval(1, 4)});

            // create doses for each of the next 7 days, starting with today (i.e. i=0)
            for (let i = 0; i < 7; i++) {
                // create a dose
                let newDose = await Dose.create({
                    user: user,
                    prescription: newPrescription,
                    medication: allMeds[i],
                    time: firstDoseTime.plus({ days: i }),
                });

                // add dose to prescription
                newPrescription.doses.push(newDose);
            }
            let updatedPrescription = await newPrescription.save();
            user.prescriptions.push(updatedPrescription);
        }
        let savedUser = await user.save();
        console.log(savedUser);
    }
}

seedPrescriptions();