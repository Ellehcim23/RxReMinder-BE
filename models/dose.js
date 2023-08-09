const mongoose = require('mongoose');

const doseSchema = new mongoose.Schema({

}, { timestamps: true });

const Dose = mongoose.model('Dose', doseSchema);

module.exports = Dose;