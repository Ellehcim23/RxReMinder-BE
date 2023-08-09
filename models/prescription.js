const mongoose = require('mongoose');

// prescription schema
const prescriptionSchema = new mongoose.Schema({

}, { timestamps: true });


// create the model
const Prescription = mongoose.model('Prescription', prescriptionSchema);

module.exports = Prescription;