const mongoose = require('mongoose');

// create the prescription schema
const prescriptionSchema = new mongoose.Schema({
    medication: { type: mongoose.Schema.Types.ObjectId, ref: 'Medication' },
    doses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dose'
    }],
    notes: String,
}, { timestamps: true });

// create model
const Prescription = mongoose.model('Prescription', prescriptionSchema);

// export the model to be used
module.exports = Prescription;