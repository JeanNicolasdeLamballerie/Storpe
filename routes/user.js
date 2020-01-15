const models = require('../models')

module.exports = app => {
// get all users
app.get('/user', (req, res) => {
    models
    .User
    .findAll()
    .then(x => res.json(x))
})


//get user by id
    app.get('/user/profile/:id', (req, res) => {
        models
        .User
        .findByPk(req.params.id, {
            include: [models.Pronostic]
        })
        .then(x => res.json(x))
    })

// create user
    app.post('/user/profile', (req, res) => {
        models
        .User
        .create(req.body)
        .then(x => res.json(x))
        })

//update user
    app.put('/user/profile/:id', (req, res) => {
        models
        .User
        .update(req.body, {
            where:{
                id: req.params.id
            }
        })
        .then(x => res.json(x))
    })

//delete user
    app.delete('/user/profile/:id', (req, res) =>{
        models
        .User
        .destroy({
            where:{
                id: req.params.id
            }
        })
        .then(() => console.log('profile deleted'))
    })

    // create a pronostic
    app.post('/user/newpronostic', (req, res) =>{
        models
        .Pronostic
        .create(req.body)
        .then(x => res.json(x))
    })

    //update a pronostic
    app.put('/user/pronostic/:id', (req, res) =>{
        models
        .Pronostic
        .update(req.body, {
            where: {
                id: req.params.id
            }
        })
        .then(x => res.json(x))
    })

    // delete a pronostic
    app.delete('/user/pronostic/:id', (req, res) =>{
        models
        .Pronostic
        .destroy({
            where:{
                id: req.params.id
            }
        })
        .then(() => console.log('profile deleted'))
    })
}
