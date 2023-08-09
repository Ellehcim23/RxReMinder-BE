// import faker
const { faker } = require('@faker-js/faker');

// create a function that returns an object of a random user with name in email
function createRandomUser() {
    let username = faker.internet.userName();
    let firstName = faker.person.firstName();
    let lastName = faker.person.lastName();
    // split the faker email
    let email = `${firstName}.${lastName}@${faker.internet.email().split('@')[1]}`;
    let birthdate = faker.date.birthdate();
    let password = faker.internet.password();
    let height = faker.number.int({ min: 60, max: 80 });
    let weight = faker.number.int({ min: 100, max: 300 });
    let phoneNumber = faker.phone.number();


    return {
        username: username,
        firstName: firstName,
        lastName: lastName,
        email: email,
        birthdate: birthdate,
        password: password,
        height: height,
        weight: weight,
        phoneNumber: phoneNumber,
    }
}

module.exports = {
    createRandomUser,
}