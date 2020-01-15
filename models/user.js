'use strict'

const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) =>{
    const User = sequelize.define('User', {
        firstname:{
            type: DataTypes.STRING,
            allowNull: false
        },
        lastname:{
            type: DataTypes.STRING,
            allowNull: false
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1000
        },
        daily_bet:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        email:{
            type: DataTypes.STRING,
            allowNull: false
        },
        pseudo:{
            type: DataTypes.STRING,
            allowNull: false
        },
        password:{
            type: DataTypes.STRING,
            allowNull: false
        }
    });
    
    User.associate = function (models) {
        User.hasMany(models.Pronostic)
    }
    return User;
};