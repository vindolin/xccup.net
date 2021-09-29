const FlyingSite = require("../config/postgres")["FlyingSite"];

const MAX_DIST_TO_SEARCH = 5000;

const siteService = {
  getById: async (id) => {
    return FlyingSite.findByPk(id);
  },

  getByName: async (shortName) => {
    return FlyingSite.findOne({
      where: {
        name: shortName,
      },
    });
  },

  create: async (site) => {
    return FlyingSite.create(site);
  },

  update: async (site) => {
    return FlyingSite.save(site);
  },

  delete: async (id) => {
    return await FlyingSite.destroy({
      where: { id },
    });
  },

  findClosestTakeoff: async (location) => {
    const query = `
    SELECT
    "id","name", ST_Distance(ST_SetSRID(ST_MakePoint(:longitude,:latitude),4326), "point") AS distance
    FROM
    "FlyingSites"
    WHERE
    ST_Distance(ST_SetSRID(ST_MakePoint(:longitude,:latitude),4326), "point") < :maxDistance
    ORDER BY 
    distance
    LIMIT 1
    `;

    const takeoffs = await FlyingSite.sequelize.query(query, {
      replacements: {
        latitude: parseFloat(location.latitude),
        longitude: parseFloat(location.longitude),
        maxDistance: MAX_DIST_TO_SEARCH,
      },
      type: FlyingSite.sequelize.QueryTypes.SELECT,
    });

    if (takeoffs.length == 1) {
      console.log("Found takeoff in DB");
      return takeoffs[0];
    } else if (takeoffs.length > 1) {
      const errorMsg = `Found more than one takeoff in DB for location ${location} within distance of ${MAX_DIST_TO_SEARCH}m`;
      console.log(errorMsg);
      return errorMsg;
    } else {
      const errorMsg = `Found no takeoff in DB within distance of ${MAX_DIST_TO_SEARCH}m`;
      console.log(errorMsg);
      return errorMsg;
    }
  },
};

module.exports = siteService;