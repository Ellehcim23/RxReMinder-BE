const mongoose = require('mongoose');

// create the medication schema
const medicationSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    category: String,
    directions: String,
}, { timestamps: true });

// create model
const Medication = mongoose.model('Medication', medicationSchema);

// export the model to be used
module.exports = Medication;