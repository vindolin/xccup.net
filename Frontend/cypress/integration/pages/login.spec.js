describe("check login options", () => {
  before(() => {
    cy.visit("/");
  });

  it("login/logout normal user", () => {
    cy.login("Clinton@Hettinger.name", "PW_ClintonHettinger");

    cy.get("#loginDropdownMenuButton").should("includes.text", "Clinton");
    cy.get("#navbarAdminDashboard").should("not.exist");

    cy.logout();

    cy.get("#loginDropdownMenuButton").should("includes.text", "Login");
  });

  it("login/logout admin", () => {
    cy.login("Camille@Schaden.name", "PW_CamilleSchaden");

    cy.get("#loginDropdownMenuButton").should("includes.text", "Camille");
    cy.get("#navbarAdminDashboard").should("exist");

    cy.logout();

    cy.get("#loginDropdownMenuButton").should("includes.text", "Login");
  });

  it("login/logout moderator", () => {
    cy.login("Olive@Emmerich.biz", "PW_OliveEmmerich");

    cy.get("#loginDropdownMenuButton").should("includes.text", "Olive");
    cy.get("#navbarAdminDashboard").should("exist");

    cy.logout();

    cy.get("#loginDropdownMenuButton").should("includes.text", "Login");
  });

  it("login non exisiting user", () => {
    cy.login("noone@neverland.it", "FancyPassword");

    //TODO: Extend this test when function is completed (e.g. user should see a warning login failed)
    cy.get("#loginDropdownMenuButton").should("includes.text", "Login");
  });
});
