const timestamp = new Date().getTime();
const monsterName = `End to end Orc ${timestamp}`;
const editedMonsterName = `End to end Ork ${timestamp}`;

describe("Monster page", () => {
  it("allows user to add monster", () => {
    cy.visit("/");
    cy.contains("Monster").click();
    cy.get('input[name="monster-name"]').type(monsterName);
    cy.get('input[name="monster-xp"]').type("100");
    cy.contains("Save").click();
    cy.contains(`SUCCESS: Added monster: ${monsterName}`);
  });

  it("allows user to edit a monster", () => {
    cy.visit("/");
    cy.contains("Monster").click();
    cy.contains(monsterName).click();
    cy.contains("Edit").click();
    cy.get('input[name="monster-name"]').clear().type(editedMonsterName);
    cy.get('input[name="monster-xp"]').clear().type("9999");
    cy.contains("Save").click();
    cy.contains(`SUCCESS: Edited monster: ${editedMonsterName}`);
  });

  it("allows user to delete a monster", () => {
    cy.visit("/");
    cy.contains("Monster").click();
    cy.contains(editedMonsterName).click();
    cy.contains("Delete").click();
    cy.contains(`SUCCESS: Successfully deleted monster`);
  });
});
