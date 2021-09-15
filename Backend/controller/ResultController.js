const express = require("express");
const router = express.Router();
const service = require("../service/ResultService");
const { query } = require("express-validator");
// const { NOT_FOUND, INTERNAL_SERVER_ERROR } = require("./Constants");
const { validationHasErrors } = require("./Validation");

// @desc Gets the overall result
// @route GET /results

router.get(
  "/",
  [
    query("year").optional().isInt(),
    query("limit").optional().isInt(),
    query("isWeekend").optional().isBoolean(),
    query("isSenior").optional().isBoolean(),
    query("ratingClass").optional().not().isEmpty().trim().escape(),
    query("gender").optional().not().isEmpty().trim().escape(),
    query("site").optional().not().isEmpty().trim().escape(),
    query("region").optional().not().isEmpty().trim().escape(),
    query("state").optional().not().isEmpty().trim().escape(),
  ],
  async (req, res, next) => {
    if (validationHasErrors(req, res)) return;
    const year = req.query.year;
    const ratingClass = req.query.ratingClass;
    const gender = req.query.gender;
    const isWeekend = req.query.weekend;
    const isSenior = req.query.isSenior;
    const limit = req.query.limit;
    const site = req.query.site;
    const region = req.query.region;
    const state = req.query.state;

    try {
      const result = await service.getOverall(
        year,
        ratingClass,
        gender,
        isWeekend,
        isSenior,
        limit,
        site,
        region,
        state
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// @desc Gets the result for a specific club
// @route GET /results/club/:club

// router.get("/club/:club", async (req, res,next) => {
//   // const result = await service.getOverall();
//   res.json(null);
// });

// @desc Gets the result for the club ranking
// @route GET /results/clubs

router.get(
  "/clubs",
  [query("year").optional().isInt(), query("limit").optional().isInt()],
  async (req, res, next) => {
    if (validationHasErrors(req, res)) return;
    const year = req.query.year;
    const limit = req.query.limit;

    try {
      const result = await service.getClub(year, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// @desc Gets the result for the team ranking
// @route GET /results/teams/

router.get(
  "/teams",
  [
    query("year").optional().isInt(),
    query("region").optional().not().isEmpty().trim().escape(),
    query("limit").optional().isInt(),
  ],
  async (req, res, next) => {
    if (validationHasErrors(req, res)) return;
    const year = req.query.year;
    const region = req.query.region;
    const limit = req.query.limit;

    try {
      const result = await service.getTeam(year, region, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
