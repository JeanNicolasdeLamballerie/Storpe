'use strict'

const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    const Pronostic = sequelize.define('Pronostic', {
        user_pronostic: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        odd_defined: {
            type: DataTypes.STRING,
            allowNull: false
        },
        resultat_pronostic: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    });

    Pronostic.associate = function (models) {
        Pronostic.belongsTo(models.User)
        Pronostic.belongsTo(models.Match)
    }
    return Pronostic;
};