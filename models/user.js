const mongoose = require('mongoose');

// create the user schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: String,
    lastName: String,
    birthdate: Date,
    phoneNumber: String,
    prescriptions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prescription'
    }],
}, { timestamps: true });

// create model
const User = mongoose.model('User', userSchema);

// export the model to be used
module.exports = User;