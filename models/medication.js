const mongoose = require('mongoose');

// create the medication schema
const medicationSchema = new mongoose.Schema({
    medicationName: { type: String, required: true, unique: true },
    directons: String
}, { timestamps: true });

// create model
const medication = mongoose.model('Medication', medicationSchema);

// export the model to be used
module.exports = medication;