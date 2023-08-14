const { User, Prescription, Dose } = require('./models/');

async function randomlyTakeDoses() {
    let doses = await Dose.find({ user: '64d47c661806b140baabaf0c'});
    // console.log(doses.length);
    
    for (let i = 0; i < doses.length; i++) {
        const random = Math.random();
        if (random > 0.5) {
            doses[i].taken = true;
            await doses[i].save();
        }
    }

    for (let i = 0; i < doses.length; i++) {
        console.log(doses[i].taken);
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

// randomlyTakeDoses();
// deleteDoseless();
deleteNoMedication();