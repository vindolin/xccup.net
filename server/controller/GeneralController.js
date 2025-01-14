const express = require("express");
const router = express.Router();
const { getCurrentActive } = require("../service/SeasonService");
const { getAllBrands } = require("../service/FlightService");
const {
  STATE: flightStates,
  TYPE: types,
  REGIONS,
} = require("../constants/flight-constants");
const {
  GENDER: genders,
  COUNTRY: countries,
  STATE: conutryStates,
  TSHIRT_SIZES,
  GENDER,
} = require("../constants/user-constants");

const { getCache, setCache } = require("./CacheManager");
const userService = require("../service/UserService");
const siteService = require("../service/FlyingSiteService");
const clubService = require("../service/ClubService");
const teamService = require("../service/TeamService");

// @desc Gets all gliderClasses of the current season
// @route GET /general/gliderClasses

router.get("/gliderClasses", async (req, res, next) => {
  try {
    const value = getCache(req);
    if (value) return res.json(value);

    const gliderClasses = (await getCurrentActive()).gliderClasses;

    setCache(req, gliderClasses);

    res.json(gliderClasses);
  } catch (error) {
    next(error);
  }
});

// @desc Gets all rankingClasses of the current season
// @route GET /general/rankingClasses

router.get("/rankingClasses", async (req, res, next) => {
  try {
    const value = getCache(req);
    if (value) return res.json(value);

    const rankingClasses = (await getCurrentActive()).rankingClasses;

    setCache(req, rankingClasses);

    res.json(rankingClasses);
  } catch (error) {
    next(error);
  }
});

// @desc Gets all brands of gliders which exist in the db
// @route GET /general/brands

router.get("/brands", async (req, res, next) => {
  try {
    const value = getCache(req);
    if (value) return res.json(value);

    const brands = await getAllBrands();

    setCache(req, brands);

    res.json(brands);
  } catch (error) {
    next(error);
  }
});

// @desc Gets all filter options for flights and results
// @route GET /general/filterOptions

router.get("/filterOptions", async (req, res, next) => {
  try {
    const value = getCache(req);
    if (value) return res.json(value);

    const userNames = userService.getAllNames();
    const siteNames = siteService.getAllNames();
    const clubNames = clubService.getAllNames();
    const teamNames = teamService.getAllNames();
    const brandNames = getAllBrands();

    const values = await Promise.all([
      userNames,
      siteNames,
      clubNames,
      teamNames,
      brandNames,
      getCurrentActive(),
    ]);

    const resultObject = {
      userNames: values[0],
      siteNames: values[1],
      clubNames: values[2],
      teamNames: values[3],
      brandNames: values[4],
      rankingClasses: values[5].rankingClasses,
      regions: REGIONS,
      genders: GENDER,
    };

    setCache(req, resultObject);

    res.json(resultObject);
  } catch (error) {
    next(error);
  }
});

// @desc Gets all possiblites of flightStates
// @route GET /general/flight/states

router.get("/flight/states", async (req, res, next) => {
  try {
    res.json(flightStates);
  } catch (error) {
    next(error);
  }
});

// @desc Gets all possiblites of flightTypes
// @route GET /general/flight/types

router.get("/flight/types", async (req, res, next) => {
  try {
    res.json(types);
  } catch (error) {
    next(error);
  }
});

// @desc Gets user profile constants
// @route GET /general/user/constants

router.get("/user/constants", async (req, res, next) => {
  try {
    const userConstants = {
      genders: genders,
      countries: countries,
      states: conutryStates,
      tShirtSizes: TSHIRT_SIZES,
    };
    res.json(userConstants);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
