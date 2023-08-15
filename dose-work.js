const { User, Prescription, Dose } = require('./models/');
const { find } = require('./models/user');

async function randomlyTakeDoses() {
    let doses = await Dose.find({ user: '64d47c661806b140baabaf0c'});
    console.log(doses.length);

    let oldDoses = doses.filter(dose => dose.time < new Date());
    console.log(oldDoses.length);

    
    for (let i = 0; i < oldDoses.length; i++) {
        const random = Math.random();
        if (random > 0.5) {
            oldDoses[i].taken = true;
            await oldDoses[i].save();
        }
    }

    for (let i = 0; i < oldDoses.length; i++) {
        console.log(oldDoses[i].taken);
    }
}

async function deleteDoseless() {
    let prescriptions = await Prescription.find({  });
    prescriptions.forEach(async (prescription) => {
        console.log(prescription.medication);
    });
}

async function deleteNoMedication() {
    // let deletedPrescription = await Prescription.findByIdAndDelete('64d7c3ed43a709d794698831');
    await Dose.deleteMany({ prescription: '64d7c3ed43a709d794698831' });



    // Delete all the doses associated with the prescription
    // await Promise.all(deletedPrescription.doses.map(async doseId => {
    //     const deletedDose = await Dose.findByIdAndDelete(doseId);
    // }));

    // Remove the prescription ID from the user's prescriptions array
    // const user = await User.findByIdAndUpdate(
    //     deletedPrescription.user,
    //     { $pull: { prescriptions: deletedPrescription._id } },
    //     { new: true }
    // );

    // console.log(deletedPrescription, user);
}

async function deleteAllPrescriptions() {
    await Prescription.deleteMany({  });
    await Dose.deleteMany({  });
}

async function deleteFakeUsers() {
    let users = await User.find();
    
    for (let i = 0; i < 49; i++) {
        console.log(i, users[i].email);
        // await User.findByIdAndDelete(users[i]._id);
    }
}

async function setAllNotifiedFalse() {
    let doses = await Dose.find({ notified: true });
    console.log(doses.length);
    doses.forEach(async dose => {
        console.log('test', dose.notified);
        dose.notified = false;
        let savedDose = await dose.save();
        console.log('after', savedDose.notified);
    });
    // process.exit(0);
}

async function setAllNotTaken() {
    let doses = await Dose.find({ taken: true });
    doses.forEach(async (dose, i) => {
        dose.taken = false;
        await dose.save();
        console.log(i);
    })
}

async function findMyPrescriptions() {
    let mikey = await User.findById('64d47c661806b140baabaf0c');
    let validPrescriptions = [];

    for (let i = 0; i < mikey.prescriptions.length; i++) {
        let findPrescription = await Prescription.findById(mikey.prescriptions[i]);
        if (findPrescription) {
            validPrescriptions.push(findPrescription);
        }
    }

    console.log(validPrescriptions.length);

    mikey.prescriptions = [];
    for (let i = 0; i < validPrescriptions.length; i++) {
        mikey.prescriptions.push(validPrescriptions[i]);
    }

    let savedMikey = await mikey.save();
    console.log(savedMikey.prescriptions);
}

// randomlyTakeDoses();
// deleteDoseless();
// deleteNoMedication();
// deleteAllPrescriptions();
// deleteFakeUsers();
setAllNotTaken();
// setAllNotifiedFalse();
// findMyPrescriptions();