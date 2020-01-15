'use strict'

const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    const Match = sequelize.define('Match', {
        sport:{
            type: DataTypes.STRING,
            allowNull: false
        },
        homeTeam: {
            type: DataTypes.STRING,
            allowNull: false
        },
        awayTeam: {
            type: DataTypes.STRING,
            allowNull: false
        },
        odd_home: {
            type: DataTypes.STRING,
            allowNull: false
        },
        odd_draw: {
            type: DataTypes.STRING,
            allowNull: false
        },
        odd_away: {
            type: DataTypes.STRING,
            allowNull: false
        },
        logo_homeTeam: {
            type: DataTypes.STRING,
            allowNull: false
        },
        logo_awayTeam: {
            type: DataTypes.STRING,
            allowNull: false
        },
        result_match: {
            type: DataTypes.INTEGER,
        },
        date_match:{
            type: DataTypes.STRING,
            allowNull: false
        }
    },{
        underscored: true
    });

    Match.associate = function (models) {
        Match.hasMany(models.Pronostic)
    }
    return Match;
};