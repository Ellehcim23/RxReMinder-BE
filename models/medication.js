const mongoose = require('mongoose');

// the subdocuments get created first - embedded document
const medicationSchema = new mongoose.Schema({

}, { timestamps: true });

// create the model
const Medication = mongoose.model('Medication', medicationSchema);

module.exports = Medication;

// export the model to be used
module.exports = medication;