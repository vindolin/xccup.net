describe("check landing page", () => {
  before(() => {
    cy.visit("/");
  });

  it("test correct values for infobox", () => {
    cy.get("h1").should("have.text", `XCCup ${new Date().getFullYear()}`);

    cy.get("#infoboxContent").should("include.text", "20 Piloten");
    cy.get("#infoboxContent").should("include.text", "44 Vereine");
    cy.get("#infoboxContent").should("include.text", "4 Teams");
    cy.get("#infoboxContent").should("include.text", "1177 km");
  });

  it("test daily ranking", () => {
    cy.get("#dailyRankingPanel").within(($dailyRankingPanel) => {
      //Consider evaluating the date within the h3 (depends on the time; till 12oclock it's the day before to today)
      cy.get("h3").should("include.text", "Tageswertung");

      //TODO: Do more than just check if the component is there
      cy.get(".leaflet-container");

      cy.get("table").find("tr").its("length").should("eq", 5);

      const isAfter12OClock = new Date().getHours() > 12;
      const firstRow = isAfter12OClock
        ? "1Leo AltenwerthStüppel74 km212 P"
        : "1Ms. LaurieBurgen12 km75 P";
      const lastRow = isAfter12OClock
        ? "5Camille SchadenKönigstuhl19 km55 P"
        : "5Ramona GislasonSchriesheim-Ölberg9 km53 P";

      cy.get("table").find("tr").first().should("have.text", firstRow);
      cy.get("table").find("tr").last().should("have.text", lastRow);
    });
  });

  it("test club ranking", () => {
    cy.get("#overallResultsTabPanel").within(($overallResultsTabPanel) => {
      cy.get(".nav-item").contains("Vereinswertung").click();
    });

    cy.get("#clubRankingTable").find("tr").its("length").should("eq", 3);
    cy.get("#clubRankingTable")
      .find("tr")
      .last()
      .should("have.text", "3Drachenflieger-Club Trier504 P430 km");
  });

  it("test team ranking", () => {
    cy.get("#overallResultsTabPanel").within(($overallResultsTabPanel) => {
      cy.get(".nav-item").contains("Teamwertung").click();
    });

    cy.get("#teamRankingTable").find("tr").its("length").should("eq", 3);
    cy.get("#teamRankingTable")
      .find("tr")
      .last()
      .should("have.text", "3Die Möwen503 P249 km");
  });

  it("test overall ranking", () => {
    cy.get("#overallResultsTabPanel").within(($overallResultsTabPanel) => {
      cy.get(".nav-item").contains("Top Flüge").click();
    });

    cy.get("#topFlights").within(($topFlights) => {
      cy.get("table").find("tr").its("length").should("eq", 5);
      cy.get("table")
        .find("tr")
        .last()
        .should("have.text", "514.11Leo AltenwerthStüppel74 km212 P");
    });
  });

  it("test sponsors", () => {
    cy.get("#sponsorsPanel").within(($sponsorsPanel) => {
      cy.get("h2").contains("Sponsoren");
    });

    cy.get("#goldSponsors")
      .find(".square-holder")
      .its("length")
      .should("eq", 3);
    cy.get("#otherSponsors")
      .find(".square-holder")
      .its("length")
      .should("eq", 17);
  });
});
