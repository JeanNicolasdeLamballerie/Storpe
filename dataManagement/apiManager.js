// This code was used in the context of the 48 Hours hackaton we performed, and was refined afterwards.

// It requests weekly and daily on an API that contains on one side all the odds linked to one fixture(sport event) through an id,
// and all the details (including teams) of fixtures on the other.
// We take that data and process it in multiple ways to :

//                  - Have some data from fixtures linked with the odds of winning to use it, once processed in the right format, in our db.
//                  - Update weekly the list of matches along with their odds.
//                  - Update daily with match winners and possibly changed odds.


const schedule = require('node-schedule') // Cron-like used to schedule the update 
const axios = require('axios')
const models = require('../models')
const url = "http://localhost:5000"
const apiUrl = "https://api-football-v1.p.rapidapi.com/v2"
//
const apiHeader = {
    "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
    "x-rapidapi-key": "b83b9990e7mshd384123d903f6a1p10dfd3jsn55c2c5a042bc"
}

module.exports = function() {
    let count = 0 // will count the amount of times the weekly update has been done for monitoring reasons
    let counter = 0 // ditto for the daily update
    let allExports = {
        fixtures:
        {
            api:
            {
                fixtures:
                    []
            }
        },
        odds:
        {
            api:
            {
                odds:
                    []
            }
        }
    }
    const matchResultCalculator = (homeTeamScore, awayTeamScore) => { //Returns 0 for a draw, 1 for a home win, 2 for a home loss.
    // is used in the daily part to set up the status of the match. We manage that number in a complementing route "(axios.put(url + "/match", updatedMatch))"
        if (homeTeamScore === awayTeamScore) {
            return 0
        }
        if (homeTeamScore > awayTeamScore) {
            return 1
        }
        if (homeTeamScore < awayTeamScore) {
            return 2
        }
    }

// Every week, this scheduled job will request from the distant api and store the data we need.
    const WeeklyUpdate = schedule.scheduleJob("2 0 * * 1", async () => {
        try {
            const response = await axios.get(apiUrl + "/fixtures/league/525", { headers: apiHeader })
            const oddsResponse = await axios.get(apiUrl + "/odds/league/525/label/1", { headers: apiHeader })
            //
            allExports.fixtures = response.data
            allExports.odds = oddsResponse.data
            count = count + 1
            console.log(`The weekly update has been done ${count} times.`)
            // The new data is now set up for dataManager to use.
        }
        catch (error) {
            console.log(error)
        }
    }
    )
    const startServer = new Date()
    startServer.setSeconds(startServer.getSeconds()+3)
    WeeklyUpdate.schedule(startServer) // This call is used to fill up the database once on server start up.


    const checkMatches = schedule.scheduleJob("5 0 * * *", async () => {  
        //This will actualize the odds of each match in the DB, and check if the match is over (and if so, send the result).

        try {
            const response = await axios.get(apiUrl + "/fixtures/league/525", { headers: apiHeader })
            const AllUpdatedMatches = response.data.api.fixtures
            /////
            const oddsResponse = await axios.get(apiUrl + "/odds/league/525/label/1", { headers: apiHeader })
            const allUpdatedOdds = oddsResponse.data.api.odds
            
            counter = counter + 1
            console.log(`The daily update has been done ${counter} times.`)
            
            // checks if odds are different and updates them everyday.
            AllUpdatedMatches.map(matchAfterUpdate => {
                // Maps on the updated fixtures then, for each, if they exist in the map of the updated odds,
                // updates the database with the new odds.
                allUpdatedOdds.map(async matchWithUpdatedOdds => {
                    // Sequelize ORM usage : on the table Matchs, update the odd values where conditions are met. 
                    if (matchAfterUpdate.fixture_id === matchWithUpdatedOdds.fixture.fixture_id) {
                        await models.Match.update({
                            odd_home: matchWithUpdatedOdds.bookmakers[2].bets[0].values[0].odd,
                            odd_draw: matchWithUpdatedOdds.bookmakers[2].bets[0].values[1].odd,
                            odd_away: matchWithUpdatedOdds.bookmakers[2].bets[0].values[2].odd
                        },
                            {
                                where: {
                                    homeTeam: matchAfterUpdate.homeTeam.team_name,
                                    awayTeam: matchAfterUpdate.awayTeam.team_name,
                                    date_match: matchAfterUpdate.event_date
                                }
                            })
                    }
                })

            }

            )
            // checks if matches in the current roster are finished, if yes, has to communicate the winner to the DB.
            models.Match.findAll() // sequelize ORM method, finding all the tuples in the match Sequelize Model/Matchs mySQL table. 
                .then(dataBaseMatches => {
                    AllUpdatedMatches.map(matchAfterUpdate => {
                        dataBaseMatches.map(async matchBeforeUpdate => {
                            if (matchAfterUpdate.statusShort === "FT" // if match after update is over(FT) and the result isn't set yet, updates it.
                                && matchBeforeUpdate.hometeam === matchAfterUpdate.homeTeam.team_name
                                && matchBeforeUpdate.awayteam === matchAfterUpdate.awayTeam.team_name
                                && matchBeforeUpdate.date_match === matchAfterUpdate.event_date
                                && matchBeforeUpdate.result_match === null) {

                                const updatedMatch = {
                                    id: matchBeforeUpdate.id,
                                    result: matchResultCalculator(matchAfterUpdate.goalsHomeTeam, matchAfterUpdate.goalsAwayTeam)
                                }
                                await axios.put(url + "/match", updatedMatch)
                            }
                        })
                    })
                })
        }
        catch (error) {
            console.log(error)
        }
    }
    )

 // Takes an object containing two subsections : fixtures and odds.
 // Fixtures contains all of the information relating to the status of the match (who plays, when, is the match finished...) 
 // while odds contains all of the odds related to a match identified only by it's ID. We use both to build the objects to the
 // formatting we want/need in frontend.
    const dataManager = (data) => {
        const myReturn = []
        const keepTrack = []
        let myCounter = 0
        ///////
        const matches = data.fixtures.api.fixtures
        const odds = data.odds.api.odds 
        console.log('odds fetched : ', odds)
        odds.map(matchOdd => {
            matches.map(matchInfo => {
                matchInfo.fixture_id === matchOdd.fixture.fixture_id
                    && matchInfo.status === 'Not Started'
                    ?
                    keepTrack.push(
                        {
                            returnId: myCounter, // Will be used to identify 
                            fixtureId: matchInfo.fixture_id 
                        })
                    & myReturn.push(
                        {
                            homeTeam: matchInfo.homeTeam.team_name,
                            logo_homeTeam: matchInfo.homeTeam.logo,
                            awayTeam: matchInfo.awayTeam.team_name,
                            logo_awayTeam: matchInfo.awayTeam.logo,
                            sport: 'football',
                            date_match: matchInfo.event_date
                        })
                    & (myCounter += 1)
                    : ''
            }
            )
        })

        odds.map(o => {
            let betHome = o.bookmakers[2].bets[0].values[0].odd
            let betDraw = o.bookmakers[2].bets[0].values[1].odd
            let betAway = o.bookmakers[2].bets[0].values[2].odd
            keepTrack.map(storedMatch => { 
                // Identifies the games already in the returned object and attributes the odds to it, so we know
                // which fixtureId is used since we don't want to keep that in the eventual return to our homemade API.
                // Instead, we used a counter to know where to place them (returnId), because said counter was only incremented
                // if the match met all our conditions and was stocked up.
                // That way, returnId always corresponds to the index of the returned object, and we linked the Id of the match.
                if (o.fixture.fixture_id === storedMatch.fixtureId) {
                    myReturn[storedMatch.returnId] = { ...myReturn[storedMatch.returnId], odd_home: betHome, odd_draw: betDraw, odd_away: betAway }
                }
            }
            )
        })

        setTimeout(() => {
            console.log("my return :", myReturn)
            axios.post(url + '/populate/matches', myReturn).then(response => response).catch(error => { console.log(error) })
        }, 6000)


    }
    setTimeout(() => { dataManager(allExports) }, 6000)
}