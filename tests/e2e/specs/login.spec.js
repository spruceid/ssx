describe('SSX', () => {
  context('Test commands', () => {
    it(`Should sign-in with default settings`, () => {
      cy.visit('/');
      cy.get('#connectButton').click();
      cy.acceptMetamaskAccess({ signInSignature: true }).then(connected => {
        expect(connected).to.be.true;
      });
    });
  });
});