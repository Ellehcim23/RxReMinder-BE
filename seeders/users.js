// seed the data with users
const { createRandomUser } = require('../utils');
const { User } = require('../models');

async function seedUsers() {
    // create a 50 users
    for (i = 0; i < 50; i++) {
        let newUser = await User.create(createRandomUser());
        console.log(i, newUser);
    }
}

seedUsers();