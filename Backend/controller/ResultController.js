const express = require("express");
const router = express.Router();
const service = require("../service/ResultService");
const { query } = require("express-validator");
// const { NOT_FOUND, INTERNAL_SERVER_ERROR } = require("./Constants");
const { validationHasErrors } = require("./Validation");

// @desc Gets the overall result
// @route GET /

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
  async (req, res) => {
    if (validationHasErrors(req, res)) return;
    let year = req.query.year;
    let ratingClass = req.query.class;
    let gender = req.query.gender;
    let isWeekend = req.query.weekend;
    let isSenior = req.query.isSenior;
    let limit = req.query.limit;
    let site = req.query.site;
    let region = req.query.region;
    let state = req.query.state;

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
  }
);

// @desc Gets the result for a specific club
// @route GET /club/:club

// router.get("/club/:club", async (req, res) => {
//   // const result = await service.getOverall();
//   res.json(null);
// });

// @desc Gets the result for the club ranking
// @route GET /clubs

router.get(
  "/clubs",
  [query("year").optional().isInt(), query("limit").optional().isInt()],
  async (req, res) => {
    if (validationHasErrors(req, res)) return;
    let year = req.query.year;
    let limit = req.query.limit;

    const result = await service.getClub(year, limit);
    res.json(result);
  }
);

// @desc Gets the result for the team ranking
// @route GET /teams/

router.get("/teams", async (req, res) => {
  // const result = await service.getOverall();
  res.json(null);
});

module.exports = router;
