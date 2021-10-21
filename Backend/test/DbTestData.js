const User = require("../config/postgres")["User"];
const Flight = require("../config/postgres")["Flight"];
const FlightComment = require("../config/postgres")["FlightComment"];
const Club = require("../config/postgres")["Club"];
const Team = require("../config/postgres")["Team"];
const FlyingSite = require("../config/postgres")["FlyingSite"];
const FlightFixes = require("../config/postgres")["FlightFixes"];
const FlightPhoto = require("../config/postgres")["FlightPhoto"];
const SeasonDetail = require("../config/postgres")["SeasonDetail"];
const Airspace = require("../config/postgres")["Airspace"];
const News = require("../config/postgres")["News"];
const Sponsor = require("../config/postgres")["Sponsor"];
const Logo = require("../config/postgres")["Logo"];

const dbTestData = {
  checkForTestDataAndAddIfMissing: async () => {
    console.log("Check if required data is found in DB");
    const userNames = await User.findAll();
    const users = require("./testdatasets/users.json");
    if (userNames != users.length) {
      console.log("Required data was not found. Will now add data to db.");

      console.log("Start adding clubs");
      const clubs = require("./testdatasets/clubs.json");
      await Promise.all(
        clubs.map(async (entry) => {
          await Club.create(entry).catch((err) => {
            console.log(err.message);
          });
        })
      );
      console.log("Finished adding clubs");

      console.log("Start adding teams");
      const teams = require("./testdatasets/teams.json");
      await Promise.all(
        teams.map(async (entry) => {
          await Team.create(entry).catch((err) => {
            console.log(err.message);
          });
        })
      );
      console.log("Finished adding teams");

      console.log("Start adding sites");
      const sites = require("./testdatasets/flyingSites.json");
      await Promise.all(
        sites.map(async (entry) => {
          await FlyingSite.create(entry).catch((err) => {
            console.log(err.message);
          });
        })
      );
      console.log("Finished adding sites");

      console.log("Start adding users");
      await Promise.all(
        users.map(async (user) => {
          await User.create(user).catch((err) => {
            console.log(err);
          });
        })
      );
      console.log("Finished adding users");

      console.log("Start adding flights");
      const flights = require("./testdatasets/flights.json");
      adjustYearOfEveryFlight(flights);
      adjustDateOfFlightToToday(flights, 5);
      await Promise.all(
        flights.map(async (flight) => {
          Flight.create(flight).catch((err) => {
            console.log(err);
          });
        })
      );
      console.log("Finished adding flights");

      console.log("Start adding flightPhotos");
      const flightPhotos = require("./testdatasets/flightPhotos.json");
      await Promise.all(
        flightPhotos.map(async (photo) => {
          FlightPhoto.create(photo).catch((err) => {
            console.log(err);
          });
        })
      );
      console.log("Finished adding flightPhotos");

      console.log("Start adding comments");
      const comments = require("./testdatasets/comments.json");
      await Promise.all(
        comments.map(async (comment) => {
          FlightComment.create(comment).catch((err) => {
            console.log(err);
          });
        })
      );
      console.log("Finished adding comments");

      console.log("Start adding seasonDetails");
      const seasonDetails = require("./testdatasets/seasonDetails.json");
      await Promise.all(
        seasonDetails.map(async (entry) => {
          await SeasonDetail.create(entry).catch((err) => {
            console.log(err.message);
          });
        })
      );
      console.log("Finished adding seasonDetails");

      console.log("Start adding airspaces");
      const airspaces = require("./testdatasets/airspaces.json");
      await Promise.all(
        airspaces.map(async (entry) => {
          await Airspace.create(entry).catch((err) => {
            console.log(err.message);
          });
        })
      );
      console.log("Finished adding airspaces");

      console.log("Start adding fixes");
      const fixes = require("./testdatasets/fixes.json");
      await Promise.all(
        fixes.map(async (entry) => {
          await FlightFixes.create(entry).catch((err) => {
            console.log(err.message);
          });
        })
      );
      console.log("Finished adding fixes");

      console.log("Start adding news");
      const news = require("./testdatasets/news.json");
      await Promise.all(
        news.map(async (entry) => {
          await News.create(entry).catch((err) => {
            console.log(err.message);
          });
        })
      );
      console.log("Finished adding news");

      console.log("Start adding sponsors");
      const sponsorsArray = require("./testdatasets/sponsors.json");
      await Promise.all(
        sponsorsArray.map(async (entry) => {
          await Sponsor.create(entry).catch((err) => {
            console.log(err.message);
          });
        })
      );
      console.log("Finished adding sponsors");

      console.log("Start adding sponsor logos");
      const logos = require("./testdatasets/logos.json");
      await Promise.all(
        logos.map(async (entry) => {
          await Logo.create(entry).catch((err) => {
            console.log(err.message);
          });
        })
      );
      console.log("Finished adding sponsor logos");
    }
  },
};

function adjustDateOfFlightToToday(flights, numberOfEntriesToAdjust) {
  for (let index = 0; index < numberOfEntriesToAdjust; index++) {
    const date = new Date(flights[index].dateOfFlight);
    const today = new Date();
    date.setFullYear(today.getFullYear());
    date.setMonth(today.getMonth());
    date.setDate(today.getDate());
    flights[index].dateOfFlight = date.toISOString();
  }
}

function adjustYearOfEveryFlight(flights) {
  const today = new Date();
  for (let index = 0; index < flights.length - 1; index++) {
    const date = new Date(flights[index].dateOfFlight);
    date.setFullYear(today.getFullYear());
    flights[index].dateOfFlight = date.toISOString();
  }
  //Ensure that one entry will always be from last year
  const lastEntryIndex = flights.length - 1;
  const date = new Date(flights[lastEntryIndex].dateOfFlight);
  date.setFullYear(today.getFullYear() - 1);
  flights[lastEntryIndex].dateOfFlight = date.toISOString();
}

module.exports = dbTestData;
