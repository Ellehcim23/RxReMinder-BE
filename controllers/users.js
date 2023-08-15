// Imports
require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { JWT_SECRET } = process.env;
const moment = require('moment');

// import the User model
const { User } = require('../models');

// GET make a users route to get all users
router.get('/', (req, res) => {
    User.find({})
        .then((users) => {
            // console.log('users', users);
            res.status(200).json({ users: users });
        })
        .catch((error) => {
            console.log('error', error);
            res.status(500).json({ message: 'There was an issue, please try again...' });
        });
});

// GET a specific user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
        } else {
            res.status(200).json(user);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user.', error });
    }
});


// private
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { id, firstName, lastName, email, username, birthdate, phoneNumber, prescriptions } = req.user; // object with user object inside
    res.status(200).json({ id, firstName, lastName, email, username, birthdate, phoneNumber, prescriptions });
});

// GET make a route that queries users by a field and value
router.get('/:field/:value', (req, res) => {
    let field = req.params.field;
    let value = req.params.value;

    User.find({ [field]: [value] })
        .then((users) => {
            let birthdateParsedUsers = users.map(user => {
                let parsedUser = { ...user._doc };
                parsedUser.birthdate = moment(user.birthdate).format('YYYY-MM-DD');
                return parsedUser;
            });
            return res.status(200).json({ users: birthdateParsedUsers });
        })
        .catch(error => {
            console.log('error', error);
            return res.status(500).json({ message: 'There was an issue please try again...' });
        });
});

// POST - adding the new user to the database
router.post('/signup', (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            // if email already exists, a user will come back
            if (user) {
                // send a 400 response
                return res.status(400).json({ message: 'Email already exists' });
            } else {
                console.log(req.body.timezone);
                // Create a new user
                const newUser = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    birthdate: req.body.birthdate,
                    phoneNumber: req.body.phoneNumber,
                    password: req.body.password,
                    timezone: req.body.timezone,
                });

                // Salt and hash the password - before saving the user
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) throw Error;

                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) console.log('==> Error inside of hash', err);
                        // Change the password in newUser to the hash
                        newUser.password = hash;
                        newUser.save()
                            .then(createdUser => {
                                // remove password from being returned inside of response, still in DB
                                if (createdUser.password) {
                                    createdUser.password = '...'; // hide the password
                                    res.json({ user: createdUser });
                                }
                            })
                            .catch(err => {
                                console.log('error with creating new user', err);
                                res.status(500).json({ message: 'Error occured... Please try again.' });
                            });
                    });
                });
            }
        })
        .catch(err => {
            console.log('Error finding user', err);
            res.status(400).json({ message: 'Error occured... Please try again.' });
        });
});

// POST - finding a user and returning the user
router.post('/login', async (req, res) => {
    const foundUser = await User.findOne({ email: req.body.email });

    if (foundUser) {
        // user is in the DB
        let isMatch = await bcrypt.compareSync(req.body.password, foundUser.password);
        if (isMatch) {
            // if user match, then we want to send a JSON Web Token
            // Create a token payload
            // add an expiredToken = Date.now()
            // save the user
            const payload = {
                id: foundUser.id,
                email: foundUser.email,
                firstName: foundUser.firstName,
                lastName: foundUser.lastName,
                birthdate: moment(foundUser.birthdate).format('MMMM Do YYYY'),
                phoneNumber: foundUser.phoneNumber,
                prescriptions: foundUser.prescriptions,
            };

            jwt.sign(payload, JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
                if (err) {
                    res.status(400).json({ message: 'Session has endedd, please log in again.' });
                }
                const legit = jwt.verify(token, JWT_SECRET, { expiresIn: 60 });
                delete legit.password; // remove before showing response
                res.json({ success: true, token: `Bearer ${token}`, userData: legit });
            });
        } else {
            return res.status(400).json({ message: 'Email or Password is incorrect.' });
        }
    } else {
        return res.status(400).json({ message: 'User not found' });
    }
});

// PUT route to update user
router.put('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const updateQuery = {};
    // check firstName
    if (req.body.firstName) {
        updateQuery.firstName = req.body.firstName;
    }
    // check lastName
    if (req.body.lastName) {
        updateQuery.lastName = req.body.lastName;
    }
    // check email
    if (req.body.email) {
        updateQuery.email = req.body.email;
    }
    // check birthdate
    if (req.body.birthdate) {
        updateQuery.birthdate = req.body.birthdate;
    }
    // check phoneNumber
    if (req.body.phoneNumber) {
        updateQuery.phoneNumber = req.body.phoneNumber;
    }

    User.findByIdAndUpdate(req.user.id, { $set: updateQuery }, { new: true })
        .then((user) => {
            return res.status(201).json({ message: `${user.email} was updated`, user: user });
        })
        .catch((error) => {
            console.log('error inside PUT /users/:id', error);
            return res.status(500).json({ message: 'Error occured, please try again.' });
        });
});


// DELETE route for /users/:id
router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {

    User.findByIdAndDelete(req.user.id)
        .then((result) => {
            return res.status(200).json({ message: `User at ${req.user.id} was deleted.` });
        })
        .catch((error) => {
            console.log('error inside DELETE /users/:id', error);
            return res.status(500).json({ message: 'Error occured, please try again.' });
        });
});

module.exports = router;