const models = require('../models')
const schedule = require ('node-schedule')
const faker = require('faker')
const data = require('../dataManagement/apiManager')
data()
module.exports = app => {
    // get all users
    app.get('/user', (req, res) => {
        models
            .User
            .findAll()
            .then(x => {
                res.json(x)
            })
    })

    // create match
    app.post('/match', (req, res) => {
        models
            .Match
            .create(req.body)
            .then(x => res.json(x))
    })

    // delete match
    app.delete('/match/:id', (req, res) => {
        models
            .Match
            .destroy({
                where: {
                    id: req.params.id
                }
            })
    })

    //get all pronostic
    app.get('/user/pronostic', (req, res) => {
        models
            .Pronostic
            .findAll()
            .then(x => res.json(x))
    })

    //faker routes post user
    app.post('/faker/user', (req, res) => {
        models
            .User
            .bulkCreate([{
                    firstname: faker.name.firstName(),
                    lastname: faker.name.lastName(),
                    daily_bet: faker.random.number(),
                    email: faker.internet.email(),
                    pseudo: faker.internet.userName(),
                    password: faker.internet.password()
                },
                {
                    firstname: faker.name.firstName(),
                    lastname: faker.name.lastName(),
                    daily_bet: faker.random.number(),
                    email: faker.internet.email(),
                    pseudo: faker.internet.userName(),
                    password: faker.internet.password()
                },
                {
                    firstname: faker.name.firstName(),
                    lastname: faker.name.lastName(),
                    daily_bet: faker.random.number(),
                    email: faker.internet.email(),
                    pseudo: faker.internet.userName(),
                    password: faker.internet.password()
                },
                {
                    firstname: faker.name.firstName(),
                    lastname: faker.name.lastName(),
                    daily_bet: faker.random.number(),
                    email: faker.internet.email(),
                    pseudo: faker.internet.userName(),
                    password: faker.internet.password()
                },
                {
                    firstname: faker.name.firstName(),
                    lastname: faker.name.lastName(),
                    daily_bet: faker.random.number(),
                    email: faker.internet.email(),
                    pseudo: faker.internet.userName(),
                    password: faker.internet.password()
                },
                {
                    firstname: faker.name.firstName(),
                    lastname: faker.name.lastName(),
                    daily_bet: faker.random.number(),
                    email: faker.internet.email(),
                    pseudo: faker.internet.userName(),
                    password: faker.internet.password()
                },
                {
                    firstname: faker.name.firstName(),
                    lastname: faker.name.lastName(),
                    daily_bet: faker.random.number(),
                    email: faker.internet.email(),
                    pseudo: faker.internet.userName(),
                    password: faker.internet.password()
                },
                {
                    firstname: faker.name.firstName(),
                    lastname: faker.name.lastName(),
                    daily_bet: faker.random.number(),
                    email: faker.internet.email(),
                    pseudo: faker.internet.userName(),
                    password: faker.internet.password()
                },
                {
                    firstname: faker.name.firstName(),
                    lastname: faker.name.lastName(),
                    daily_bet: faker.random.number(),
                    email: faker.internet.email(),
                    pseudo: faker.internet.userName(),
                    password: faker.internet.password()
                },
                {
                    firstname: faker.name.firstName(),
                    lastname: faker.name.lastName(),
                    daily_bet: faker.random.number(),
                    email: faker.internet.email(),
                    pseudo: faker.internet.userName(),
                    password: faker.internet.password()
                },
                {
                    firstname: faker.name.firstName(),
                    lastname: faker.name.lastName(),
                    daily_bet: faker.random.number(),
                    email: faker.internet.email(),
                    pseudo: faker.internet.userName(),
                    password: faker.internet.password()
                },
                {
                    firstname: faker.name.firstName(),
                    lastname: faker.name.lastName(),
                    daily_bet: faker.random.number(),
                    email: faker.internet.email(),
                    pseudo: faker.internet.userName(),
                    password: faker.internet.password()
                },
                {
                    firstname: faker.name.firstName(),
                    lastname: faker.name.lastName(),
                    daily_bet: faker.random.number(),
                    email: faker.internet.email(),
                    pseudo: faker.internet.userName(),
                    password: faker.internet.password()
                },
                {
                    firstname: faker.name.firstName(),
                    lastname: faker.name.lastName(),
                    daily_bet: faker.random.number(),
                    email: faker.internet.email(),
                    pseudo: faker.internet.userName(),
                    password: faker.internet.password()
                }
            ])
            .then(x => res.json(x))
    })

    //create match
    app.post('/match', (req, res) => {
        models
            .Match
            .create(req.body)
            .then(x => res.json(x))
    })
    //populate match

        app.post('/populate/matches', (req, res) => {
            models
                .Match
                .bulkCreate(req.body)
                .then(x => res.json(x))
        })
}
