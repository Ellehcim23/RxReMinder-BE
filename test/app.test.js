// import the server
const app = require('../app'); // make the server is exported from app.js
// what's needed for testing
const request = require('supertest');
const expect = require('chai').expect;

// import faker
const { faker } = require('@faker-js/faker');

// test home route
describe('GET /', () => {
    it('returns a 200 response', (done) => {
        request(app).get('/')
            .expect(200, done);
    });
});


// test users
describe('GET /users', () => {
    it('returns a 200 response', (done) => {
        request(app).get('/users')
            .expect(200, done);
    });
    it('returns a user with email', (done) => {
        request(app).get('/users')
            .then(result => {
                // console.log('result', result._body.users[0]);
                expect(result._body.users[0]).to.have.property('email');
                done();
            });
    });
});

// test POST route
describe('POST /users/new', () => {
    it('should create a new user and have valid email', (done) => {
        const randomEmail = faker.internet.email();
        request(app).post('/users/signup')
            .type('form')
            .send({
                email: randomEmail,
                password: 'test',
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                birthdate: "1984-02-24T18:11:20.246Z",
                phoneNumber: "(500) 519-6792",
                timezone: 5,
            })
            .then(response => {
                expect(response._body.user.email).to.be.equal(randomEmail);
                done();
            })
            .catch(error => {
                console.log('error', error);
                throw error;
            });
    });

    it('returns a 200 response', (done) => {
        const randomEmail = faker.internet.email();
        request(app).post('/users/signup')
            .type('form')
            .send({
                email: randomEmail,
                password: 'test',
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                birthdate: "1984-02-24T18:11:20.246Z",
                phoneNumber: "(500) 519-6792",
                timezone: 5,
            })
            .expect(200, done);
    });
});

// test login route
describe('POST /users/login', () => {
    it('returns a 200 response', (done) => {
        const randomEmail = faker.internet.email();
        request(app).post('/users/signup')
            .type('form')
            .send({
                email: randomEmail,
                password: 'test',
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                birthdate: "1984-02-24T18:11:20.246Z",
                phoneNumber: "(500) 519-6792",
                timezone: 5,
            })
            .then(response => {
                request(app).post('/users/login')
                    .type('form')
                    .send({
                        email: randomEmail,
                        password: 'test',
                    })
                    .expect(200, done);
            });
    });
});

// test prescriptions
describe('GET /prescriptions', () => {
    it('returns a 200 response', (done) => {
        request(app).get('/prescriptions')
            .expect(200, done);
    });
    
});

// test medications
describe('GET /medications', () => {
    it('returns a 200 response', (done) => {
        request(app).get('/medications')
            .expect(200, done);
    }); 
});

// test doses
describe('GET /doses', () => {
    it('returns a 200 response', (done) => {
        request(app).get('/doses')
            .expect(200, done);
    });
}
);