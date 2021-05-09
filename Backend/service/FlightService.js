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
  delete: async (flightId) => {
    const numberOfDestroyedRows = await Flight.destroy({
      where: { id: flightId },
    });
    console.log("Entries deleted: ", numberOfDestroyedRows);
    return numberOfDestroyedRows;
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
    flight.flightTurnpoints = result.turnpoints;
    flight.igcUrl = result.igcUrl;
    flight.save();
  },
  save: async (flight) => {
    return await Flight.create(flight);
  },
  startResultCalculation: async (flight) => {
    IgcAnalyzer.startCalculation(flight, (result) =>{
      flightService.addResult(result);
    });
  },
};

module.exports = flightService;
