const mongoose = require('mongoose');

// the subdocuments get created first - embedded document
const medicationSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    category: String,
    directions: String,
}, { timestamps: true });

// create model
const Medication = mongoose.model('Medication', medicationSchema);

// export the model to be used
module.exports = Medication;