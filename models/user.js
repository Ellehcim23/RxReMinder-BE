const mongoose = require('mongoose');

// create the user schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    firstName: String,
    lastName: String,
    email: { type: String, required: true, unique: true },
    birthdate: Date,
    password: { type: String, required: true },
    height: Number,
    weight: Number,
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