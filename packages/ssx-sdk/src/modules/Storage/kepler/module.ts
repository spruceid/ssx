import { kepler } from '@spruceid/ssx-sdk-wasm';

type KeplerModule = typeof kepler;
const msg =
  "Has Kepler been initialised? 'global.keplerModule' is not of the expected type";

function getModule(): KeplerModule {
  try {
    return global.keplerModule;
  } catch (e) {
    throw `${msg}: ${e}`;
  }
}

export const makeOrbitId: KeplerModule['makeOrbitId'] = (...args) => {
  try {
    return getModule().makeOrbitId(...args);
  } catch (e) {
    throw `${msg}: ${e}`;
  }
};

export const prepareSession: KeplerModule['prepareSession'] = (...args) => {
  try {
    return getModule().prepareSession(...args);
  } catch (e) {
    throw `${msg}: ${e}`;
  }
};

export const completeSessionSetup: KeplerModule['completeSessionSetup'] = (
  ...args
) => {
  try {
    return getModule().completeSessionSetup(...args);
  } catch (e) {
    throw `${msg}: ${e}`;
  }
};

export const invoke: KeplerModule['invoke'] = (...args) => {
  try {
    return getModule().invoke(...args);
  } catch (e) {
    throw `${msg}: ${e}`;
  }
};

export const generateHostSIWEMessage: KeplerModule['generateHostSIWEMessage'] =
  (...args) => {
    try {
      return getModule().generateHostSIWEMessage(...args);
    } catch (e) {
      throw `${msg}: ${e}`;
    }
  };

export const siweToDelegationHeaders: KeplerModule['siweToDelegationHeaders'] =
  (...args) => {
    try {
      return getModule().siweToDelegationHeaders(...args);
    } catch (e) {
      throw `${msg}: ${e}`;
    }
  };
