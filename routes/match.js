const models = require('../models')
const resultToPoints = require('../assets/assets')


module.exports = app => {

    // get all match
    app.get('/match', (req, res) => {
        models
            .Match
            .findAll()
            .then(x => res.json(x))
    })

    //get football match
    app.get('/match/football', (req, res) => {
        models
        .Match
        .findAll({
            where: {
                sport: 'football'
            }
        })
        .then(x => res.json(x))
    })

    //get basketball match (not working)
    app.get('/match/basketball', (req, res) => {
        models
        .Match
        .findAll(req.params.sport, {
            where: {
                sport: 'basketball'
            }
        })
        .then(x => res.json(x))
    })

    //get match by id
    app.get('/match/:id', (req, res) => {
        models
            .Match
            .findByPk(req.params.id)
            .then(x => res.json(x))
    })

    //update match : id, result in the body
    app.put('/match', (req, res) => {
        models
            .Match
            .update({  // updates the results of the match in the db first.
                result_match: req.body.result
            }, {
                where: {
                    id: req.body.id
                }
            })
            .then(e => {
                models
                    .Pronostic
                    .update({ // Then, updates the results of the pronostics in each tuple 
                        //       that includes the foreign match key.
                        resultat_pronostic: req.body.result
                    }, {
                        where: {
                            matchId: req.body.id
                        }
                    })
                    .then(d => { //the update method returns a boolean on whether something to be updated existed or not,
                                // not the modified elements, so I had to call it again.
                    models
                    .Pronostic
                    .findAll({
                        where:
                        {
                            matchId:req.body.id
                        }
                    })
                    .then(allPronosticsLinkedToMatch => { //returns an array
                        allPronosticsLinkedToMatch.map(prono => { //each pronostic, according to a defined odd linked to it,
                                                                 //and whether the user was right or not, needs to increment the
                                                                //score. (The result from resultToPoints can be negative, so it'll de facto decrement it too)
                            const win = prono.user_pronostic === prono.resultat_pronostic
                            const changeScore = resultToPoints(prono.odd_defined, win)
                            models
                                .User
                                .increment(
                                    ['score'], {
                                        by: changeScore,
                                        where: {
                                            id: prono.UserId
                                        }
                                    }
                                )
                        })
                    }).then(x => res.send('ok'))
                })
            })

    })
}