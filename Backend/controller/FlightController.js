const express = require("express");
const router = express.Router();
const service = require("../service/FlightService");
const igcValidator = require("../igc/IgcValidator");
const path = require("path");
const fs = require("fs");
const {
  NOT_FOUND,
  BAD_REQUEST,
  // OK,
  // INTERNAL_SERVER_ERROR,
} = require("./Constants");

// @desc Retrieves all flights
// @route GET /flight/

router.get("/", async (req, res) => {
  const flights = await service.getAll();
  res.json(flights);
});

// @desc Retrieve a flight by id
// @route GET /flight/:id

router.get("/:id", async (req, res) => {
  const flight = await service.getByIdForDisplay(req.params.id);

  if (!flight) {
    res.sendStatus(NOT_FOUND);
    return;
  }

  res.json(flight);
});

// @desc Deletes a flight by id
// @route DELETE /flight/:id

router.delete("/:id", async (req, res) => {
  const numberOfDestroyedRows = await service.delete(req.params.id);
  if (!numberOfDestroyedRows) {
    res.sendStatus(NOT_FOUND);
    return;
  }
  res.json(numberOfDestroyedRows);
});

// @desc Performs a check on the G-Record of a provided IGC-File and if valid persists the IGC-File.
// @route POST /flight/

router.post("/", async (req, res) => {
  const igc = req.body.igc;
  const userId = req.body.userId;

  try {
    checkParamsForIgc(igc);
  } catch (error) {
    res.status(BAD_REQUEST).send(error);
    return;
  }

  igcValidator.execute(igc).then((result) => {
    if (result == igcValidator.G_RECORD_FAILED) {
      // res.status(BAD_REQUEST).send("Invalid G-Record");
      // return;
      // TODO Current example is invalid! Repair it!
    }
    service
      .create({
        userId: userId,
        uncheckedGRecord: result == undefined ? true : false,
        flightStatus: service.STATE_IN_PROCESS,
      })
      .then((flight) =>
        persistIgcFile(flight.id, igc).then(async (igcUrl) => {
          flight.igcUrl = igcUrl;

          await service.extractFixesAndAddLocations(flight);

          service.update(flight).then((flight) => {
            res.json({
              flightId: flight.id,
              takeoff: flight.takeoff,
              landing: flight.landing,
            });
          });
        })
      );
  });
});

// @desc Adds futher data to a existing flight and starts the igc calculation if no igc result are present.
// @route PUT /flight/:id

router.put("/:id", async (req, res) => {
  const report = req.body.report;
  const glider = req.body.glider;
  const flightId = req.params.id;

  service
    .getById(flightId)
    .then((flight) => {
      flight.report = report;
      flight.glider = glider;
      service.update(flight).then((flight) => {
        res.json(flight.externalId);
        if (!flight.flightDistance) service.startResultCalculation(flight);
      });
    })
    .catch(() => {
      res.sendStatus(NOT_FOUND);
    });
});

//TODO Move to helper class "FileWriter"
async function persistIgcFile(flightId, igcFile) {
  const store = process.env.FLIGHT_STORE;
  const pathToFolder = path.join(store, flightId.toString());
  const pathToFile = path.join(pathToFolder.toString(), igcFile.name);
  const fsPromises = fs.promises;
  fs.mkdirSync(pathToFolder, { recursive: true });
  console.log(`Will write received IGC File to: ${pathToFile}`);
  await fsPromises.writeFile(pathToFile.toString(), igcFile.body);
  return pathToFile;
}

function checkParamsForIgc(igc) {
  const result = igc.name && igc.body;
  if (!result) {
    throw "A parameter was invalid. The parameters igc.name and igc.body are required.";
  }
}

module.exports = router;
