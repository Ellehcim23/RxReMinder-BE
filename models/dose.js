const mongoose = require('mongoose');

// create the dose schema
const doseSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    prescription: { type: mongoose.Schema.Types.ObjectId, ref: 'Prescription' },
    medication: { type: mongoose.Schema.Types.ObjectId, ref: 'Medication' },
    time: Date,
    taken: Boolean,
    notified: Boolean,
}, { timestamps: true });

// create model
const Dose = mongoose.model('Dose', doseSchema);

// export the model to be used
module.exports = Dose;