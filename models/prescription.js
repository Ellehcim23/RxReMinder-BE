const mongoose = require('mongoose');

// create the prescription schema
const prescriptionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    medication: { type: mongoose.Schema.Types.ObjectId, ref: 'Medication' },
    doses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dose'
    }],
    quantity: Number,
    notes: String,
}, { timestamps: true });

// create model
const Prescription = mongoose.model('Prescription', prescriptionSchema);

// export the model to be used
module.exports = Prescription;