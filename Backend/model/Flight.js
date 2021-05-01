const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/postgres.js");
const FlightComment = require("./FlightComment.js");
const FlightFixes = require("./FlightFixes.js");

const Flight = db.sequelize.define("Flight", {
  report: {
    type: DataTypes.STRING(5000), //Default is VARCHAR(255)
  },
  flightPoints: {
    type: DataTypes.INTEGER,
  },
  flightDistance: {
    type: DataTypes.DOUBLE,
  },
  flightType: {
    type: DataTypes.ENUM,
    values: ["JOJO", "FLAT", "FAI"],
  },
  flightStatus: {
    type: DataTypes.ENUM,
    values: ["Nicht in Wertung", "In Wertung", "Flugbuch", "In Bearbeitung"],
  },
  flightCornerpoints: {
    type: DataTypes.JSON,
  },
  igcUrl: {
    type: DataTypes.STRING,
  },
  aircraft: {
    type: DataTypes.STRING,
  },
});

Flight.hasMany(FlightComment, {
  as: "comments",
  foreignKey: {
    name: "flightId",
    allowNull: false,
  },
  onDelete: "CASCADE",
  hooks: true,
});

Flight.hasOne(FlightFixes, {
  as: "fixes",
  foreignKey: {
    name: "flightId",
    allowNull: false,
  },
  onDelete: "CASCADE",
  hooks: true,
});

module.exports = Flight;
