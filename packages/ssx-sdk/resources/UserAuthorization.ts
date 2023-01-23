interface IUserAuthorization {
  // createUserAuthorization
    // connect()
    // signIn()
  // getUserAuthorization
    // getSIWE
    // getSessionData
    // getCapabilities
  // listUserAuthorization
  // deleteUserAuthorization
    // signOut()
  // updateUserAuthorization
    // requestCapabilities()
}

class UserAuthorization implements IUserAuthorization {}

export { IUserAuthorization, UserAuthorization };
