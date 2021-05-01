const Flight = require("../model/Flight.js");
const IgcAnalyzer = require("../igc/IgcAnalyzer");

const flightService = {
  getAll: async () => {
    const flights = await Flight.findAll();
    console.log("Service: ", flights);
    return flights;
  },
  getById: async (flightId) => {
    const flight = await Flight.findOne({
      where: { id: flightId },
      include: { all: true },
    });
    console.log("Service: ", flight);
    return flight;
  },
  addResult: async (result) => {
    console.log("ADD RESULT TO FLIGHT");
    const flight = await Flight.findOne({
      where: { id: result.flightId },
    });
    flight.flightPoints = Math.round(result.pts);
    flight.flightDistance = result.dist;
    flight.flightType = result.type;
    flight.flightStatus = "In Wertung";
    const cornerPointsAsString = JSON.stringify(result.cornerpoints);
    console.log("CPAS: ", cornerPointsAsString);
    flight.flightCornerpoints = cornerPointsAsString;
    flight.igcUrl = result.igcUrl;
    flight.save();
  },
  save: async (flight) => {
    return await Flight.create(flight);
  },
  startResultCalculation: async (flight) => {
    IgcAnalyzer.startCalculation(flight);
  },
};

module.exports = flightService;
