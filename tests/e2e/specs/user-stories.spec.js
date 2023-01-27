describe('SSX', () => {
  context('User Stories', () => {
    it(`Visit home page.`, () => {
      cy.visit('/');
    });

    it(`Story 1 - Users should be able to sign in with Ethereum using MetaMask without defining DAO, server, ENS, and SIWE configuration.`, () => {
      // sign in
      cy.get('#signInButton').click();
      cy.acceptMetamaskAccess({
        signInSignature: true
      }).then(connected => {
        expect(connected).to.be.true;
      });
      cy.get('#userAddress').should(
        'have.text',
        '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
      );

      // sign out
      cy.get('#signOutButton').click();
    });

    it(`Story 2 - Users should receive a popup to select the DAO login wallet options the user is part of.`, () => {
      // configure settings
      cy.get('#selectPreferences').click();
      cy.get('#enableDaoLogin-On').click();
      cy.get('#selectPreferences').click();

      // sign in
      cy.get('#signInButton').click();
      cy.confirmMetamaskSignatureRequest().then(confirmed => {
        expect(confirmed).to.be.true;
      });
      cy.get('#userAddress').should(
        'have.text',
        '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
      );

      // sign out
      cy.get('#signOutButton').click();

      // reset settings
      cy.get('#selectPreferences').click();
      cy.get('#enableDaoLogin-Off').click();
      cy.get('#selectPreferences').click();
    });

    it(`Story 3 - Users should be able to sign in with Ethereum using MetaMask with DAO Login and Server enabled.`, () => {
      // configure settings
      cy.get('#selectPreferences').click();
      cy.get('#enableDaoLogin-On').click();
      cy.get('#server-On').click();
      cy.get('#selectPreferences').click();

      // sign in
      cy.get('#Host').type('http://localhost:3001');
      cy.get('#signInButton').click();
      cy.confirmMetamaskSignatureRequest().then(confirmed => {
        expect(confirmed).to.be.true;
      });
      cy.get('#userAddress').should(
        'have.text',
        '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
      );

      // sign out
      cy.get('#signOutButton').click();

      // reset settings
      cy.get('#Host').focus().clear();
      cy.get('#selectPreferences').click();
      cy.get('#enableDaoLogin-Off').click();
      cy.get('#server-Off').click();
      cy.get('#selectPreferences').click();
    });

    it(`Story 4 - Users should be able to sign in with Ethereum using MetaMask with DAO Login and resolving ENS on server.`, () => {
      // configure settings
      cy.get('#selectPreferences').click();
      cy.get('#enableDaoLogin-On').click();
      cy.get('#server-On').click();
      cy.get('#resolveEns-On').click();
      cy.get('#selectPreferences').click();
      cy.get('#resolveOnServer-On').click();

      // sign in
      cy.get('#Host').type('http://localhost:3001');
      cy.get('#signInButton').click();
      cy.confirmMetamaskSignatureRequest().then(confirmed => {
        expect(confirmed).to.be.true;
      });
      cy.get('#userAddress', {
          defaultCommandTimeout: 60000
        }).should(
        'have.text',
        '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
      );

      // sign out
      cy.get('#signOutButton').click();

      // reset settings
      cy.get('#Host').focus().clear();
      cy.get('#resolveOnServer-Off').click();
      cy.get('#selectPreferences').click();
      cy.get('#enableDaoLogin-Off').click();
      cy.get('#server-Off').click();
      cy.get('#resolveEns-Off').click();
      cy.get('#selectPreferences').click();
    });

    it(`Story 5 - Users should be able to sign in with Ethereum using MetaMask and resolve ENS at client side.`, () => {
      // configure settings
      cy.get('#selectPreferences').click();
      cy.get('#enableDaoLogin-On').click();
      cy.get('#resolveEns-On').click();
      cy.get('#selectPreferences').click();

      // sign in
      cy.get('#signInButton').click();
      cy.confirmMetamaskSignatureRequest().then(confirmed => {
        expect(confirmed).to.be.true;
      });
      cy.get('#userAddress').should(
        'have.text',
        '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
      );

      // sign out
      cy.get('#signOutButton').click();

      // reset settings
      cy.get('#selectPreferences').click();
      cy.get('#enableDaoLogin-Off').click();
      cy.get('#resolveEns-Off').click();
      cy.get('#selectPreferences').click();
    });

    it(`Story 6 - Users should be able to sign in with Ethereum using MetaMask even if trying to resolve ENS at server side without a server.`, () => {
      // configure settings
      cy.get('#selectPreferences').click();
      cy.get('#enableDaoLogin-On').click();
      cy.get('#resolveEns-On').click();
      cy.get('#selectPreferences').click();
      cy.get('#resolveOnServer-On').click();

      // sign in
      cy.get('#signInButton').click();
      cy.confirmMetamaskSignatureRequest().then(confirmed => {
        expect(confirmed).to.be.true;
      });
      cy.get('#userAddress').should(
        'have.text',
        '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
      );

      // sign out
      cy.get('#signOutButton').click();

      // reset settings
      cy.get('#resolveOnServer-Off').click();
      cy.get('#selectPreferences').click();
      cy.get('#enableDaoLogin-Off').click();
      cy.get('#resolveEns-Off').click();
      cy.get('#selectPreferences').click();
    });
    
    it(`Story 7 - Users should be able to sign in with Ethereum using MetaMask with DAO Login, resolve ENS on server and SIWE Config.`, () => {
      // configure settings
      cy.get('#selectPreferences').click();
      cy.get('#enableDaoLogin-On').click();
      cy.get('#server-On').click();
      cy.get('#resolveEns-On').click();
      cy.get('#siweConfig-On').click();
      cy.get('#selectPreferences').click();
      cy.get('#resolveOnServer-On').click();

      // sign in
      cy.get('#Host').type('http://localhost:3001');
      cy.get('#signInButton').click();
      cy.confirmMetamaskSignatureRequest().then(confirmed => {
        expect(confirmed).to.be.true;
      });
      cy.get('#userAddress', {
        timeout: 60000
      }).should(
        'have.text',
        '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
      );

      // sign out
      cy.get('#signOutButton').click();

      // reset settings
      cy.get('#Host').focus().clear();
      cy.get('#resolveOnServer-Off').click();
      cy.get('#selectPreferences').click();
      cy.get('#enableDaoLogin-Off').click();
      cy.get('#server-Off').click();
      cy.get('#resolveEns-Off').click();
      cy.get('#siweConfig-Off').click();
      cy.get('#selectPreferences').click();
    });

    it(`Story 8 - Users should be able to sign in with Ethereum using Web3Modal v1.`, () => {
      // configure settings
      cy.get('#selectPreferences').click();
      cy.get('#provider-Web3Modal').click();
      cy.get('#selectPreferences').click();

      // sign in
      cy.get('#signInButton').click();
      cy.confirmMetamaskSignatureRequest().then(confirmed => {
        expect(confirmed).to.be.true;
      });
      cy.get('#userAddress').should(
        'have.text',
        '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
      );

      // sign out
      cy.get('#signOutButton').click();

      // reset settings
      cy.get('#selectPreferences').click();
      cy.get('#provider-MetaMask').click();
      cy.get('#selectPreferences').click();
    });

    it(`Story 9 - Users should be able to sign in with Ethereum using Web3Modal v1 + WalletConnect.`, () => {
      // configure settings
      cy.get('#selectPreferences').click();
      cy.get('#provider-Web3ModalandWalletConnect').click();
      cy.get('#selectPreferences').click();

      // sign in
      cy.get('#signInButton').click();
      cy.contains('Connect to your MetaMask Wallet').click();
      cy.confirmMetamaskSignatureRequest().then(confirmed => {
        expect(confirmed).to.be.true;
      });
      cy.get('#userAddress').should(
        'have.text',
        '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
      );

      // sign out
      cy.get('#signOutButton').click();

      // reset settings
      cy.get('#selectPreferences').click();
      cy.get('#provider-MetaMask').click();
      cy.get('#selectPreferences').click();
    });

    it(`Story 10 - Users should be able to sign in with Ethereum using Web3Modal v1 defining DAO login as true .`, () => {
      // configure settings
      cy.get('#selectPreferences').click();
      cy.get('#provider-Web3Modal').click();
      cy.get('#enableDaoLogin-On').click();
      cy.get('#selectPreferences').click();

      // sign in
      cy.get('#signInButton').click();
      cy.confirmMetamaskSignatureRequest().then(confirmed => {
        expect(confirmed).to.be.true;
      });
      cy.get('#userAddress').should(
        'have.text',
        '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
      );

      // sign out
      cy.get('#signOutButton').click();

      // reset settings
      cy.get('#selectPreferences').click();
      cy.get('#provider-MetaMask').click();
      cy.get('#enableDaoLogin-Off').click();
      cy.get('#selectPreferences').click();
    });

  });
});