const express = require("express");
const router = express.Router();
const service = require("../service/FlightService");
const igcValidator = require("../igc/IgcValidator");
const path = require("path");
const fs = require("fs");
const { NOT_FOUND } = require("./Constants");
const { authToken, requesterIsNotOwner } = require("./Auth");
const { query } = require("express-validator");
const {
  checkStringObjectNotEmpty,
  checkOptionalStringObjectNotEmpty,
  checkParamIsUuid,
  validationHasErrors,
} = require("./Validation");

// All requests to /flights/picture will be rerouted
router.use("/pictures", require("./FlightPhotoController"));

// @desc Retrieves all flights
// @route GET /flights/

router.get(
  "/",
  [
    query("year").optional().isInt(),
    query("site").optional().not().isEmpty().trim().escape(),
    query("type").optional().not().isEmpty().trim().escape(),
    query("rankingClass").optional().not().isEmpty().trim().escape(),
    query("limit").optional().isInt(),
    query("startDate").optional().isDate(), //e.g. 2002-07-15
    query("endDate").optional().isDate(),
    query("pilot").optional().not().isEmpty().trim().escape(),
  ],
  async (req, res, next) => {
    if (validationHasErrors(req, res)) return;
    const year = req.query.year;
    const site = req.query.site;
    const type = req.query.type;
    const rankingClass = req.query.rankingClass;
    const limit = req.query.limit;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const pilot = req.query.pilot;

    try {
      const flights = await service.getAll(
        year,
        site,
        type,
        rankingClass,
        limit,
        null,
        startDate,
        endDate,
        pilot
      );
      res.json(flights);
    } catch (error) {
      next(error);
    }
  }
);

// @desc Retrieve a flight by id
// @route GET /flights/:id

router.get("/:id", checkParamIsUuid("id"), async (req, res, next) => {
  if (validationHasErrors(req, res)) return;

  try {
    const flight = req.flight;
    res.json(flight);
  } catch (error) {
    next(error);
  }
});

// @desc Deletes a flight by id
// @route DELETE /flights/:id
// @access Only owner

router.delete(
  "/:id",
  checkParamIsUuid("id"),
  authToken,
  async (req, res, next) => {
    if (validationHasErrors(req, res)) return;
    const flightId = req.params.id;

    try {
      if (await requesterIsNotOwner(req, res, req.flight.userId)) return;

      const numberOfDestroyedRows = await service.delete(flightId);
      res.json(numberOfDestroyedRows);
    } catch (error) {
      next(error);
    }
  }
);

// @desc Performs a check on the G-Record of a provided IGC-File and if valid persists the IGC-File.
// @route POST /flights/
// @access Only owner

router.post(
  "/",
  authToken,
  checkStringObjectNotEmpty("igc.name"),
  checkStringObjectNotEmpty("igc.body"),
  async (req, res, next) => {
    if (validationHasErrors(req, res)) return;
    const igc = req.body.igc;
    const userId = req.user.id;
    try {
      if (await requesterIsNotOwner(req, res, userId)) return;

      const validationResult = await igcValidator.execute(igc);
      // if (validationResult == igcValidator.G_RECORD_FAILED) {
      //   // res.status(BAD_REQUEST).send("Invalid G-Record");
      //   // return;
      //   // TODO Current example is invalid! Repair it!
      // }

      const flightDbObject = await service.create({
        userId,
        uncheckedGRecord: validationResult == undefined ? true : false,
        flightStatus: service.STATE_IN_PROCESS,
      });

      flightDbObject.igcUrl = await persistIgcFile(flightDbObject.id, igc);

      service.startResultCalculation(flightDbObject);

      const takeoffName = await service.extractFixesAddLocationsAndDateOfFlight(
        flightDbObject
      );

      const result = await service.update(flightDbObject);

      res.json({
        flightId: result.id,
        takeoff: takeoffName,
        landing: result.landing,
      });
    } catch (error) {
      next(error);
    }
  }
);

// @desc Edits flightReport, flightStatus and glider of a existing flight and calcs the flightPoints
// @route PUT /flights/:id
// @access Only owner

router.put(
  "/:id",
  authToken,
  checkParamIsUuid("id"),
  checkOptionalStringObjectNotEmpty("report"),
  checkOptionalStringObjectNotEmpty("status"),
  checkStringObjectNotEmpty("glider.brand"),
  checkStringObjectNotEmpty("glider.model"),
  checkStringObjectNotEmpty("glider.gliderClass"),
  async (req, res, next) => {
    if (validationHasErrors(req, res)) return;
    const flight = req.flight;
    const report = req.body.report;
    const status = req.body.status;
    const glider = req.body.glider;

    try {
      if (await requesterIsNotOwner(req, res, flight.userId)) return;

      const result = await service.finalizeFlightSubmission(
        flight,
        report,
        status,
        glider
      );
      res.json({
        flightPoints: result[1][0].flightPoints,
        flightStatus: result[1][0].flightStatus,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Handle not found db entry
router.param("id", async (req, res, next, id) => {
  try {
    const flight = await service.getByIdForDisplay(id);
    if (!flight) return res.sendStatus(NOT_FOUND);
    req.flight = flight;
    next();
  } catch (error) {
    next(error);
  }
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

module.exports = router;
