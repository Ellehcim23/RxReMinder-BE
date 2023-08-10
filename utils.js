// import faker
const { faker } = require('@faker-js/faker');

// create a function that returns an object of a random user with name in email
function createRandomUser() {
    let firstName = faker.person.firstName();
    let lastName = faker.person.lastName();
    // split the faker email
    let email = `${firstName}.${lastName}@${faker.internet.email().split('@')[1]}`;
    let birthdate = faker.date.birthdate();
    let password = faker.internet.password();
    let phoneNumber = faker.phone.number();


    return {
        firstName: firstName,
        lastName: lastName,
        email: email,
        birthdate: birthdate,
        password: password,
        phoneNumber: phoneNumber,
    }
}

function randIntInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = {
    createRandomUser,
    randIntInterval,
}