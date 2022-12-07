const { generateTestingUtils } = require("eth-testing");
const { TextEncoder: TE, TextDecoder: TD } = require("util");

global.TextEncoder = TE;
global.TextDecoder = TD;

const { SSX } = require("../src");

const testingUtils = generateTestingUtils({ providerType: "MetaMask" });

beforeAll(() => {
  // Manually inject the mocked provider in the window as MetaMask does
  (global.window as any).ethereum = testingUtils.getProvider();
});

afterEach(() => {
  testingUtils.clearAllMocks();
});

test("Instantiate SSX with window.ethereum", () => {
  expect(() => {
    const ssx = new SSX();
  }).not.toThrowError();
});

test("Instantiate SSX with providers.web3.driver", () => {
  expect(() => {
    const config = {
      providers: {
        web3: {
          driver: testingUtils.getProvider(),
        },
      },
    };
    const ssx = new SSX(config);
  }).not.toThrowError();
});

test('Should override paths successfully', async () => {
  expect(() => {
    const ssx = new SSX({
      providers: {
        server: {
          host: 'http://localhost:3001',
          endpoints: {
            nonce: '/ssx-custom-nonce',
            login: '/ssx-custom-login',
            logout: '/ssx-custom-logout',
          }
        }
      }
    });
  }).not.toThrowError();
});

// test('Connect to wallet', async () => {
//   // TODO: expose wallet connection interface
// });

// test('Sign-in with Ethereum', () => {
//   // TODO: sign request with mock provider
//   expect(async () => {
//     const config = {
//       providers: {
//         web3: {
//           driver: provider,
//         },
//       },
//     };
//     const ssx = new SSX(config);
//     await ssx.signIn();
//   }).not.toThrowError();
// });

// test('Throw Error if Ethereum Wallet isn\'t found', () => {
//   // TODO: Throw error if no wallet is found
//   // global.window.ethereum = undefined;
//   // const ssx = ;
//   // expect(() => { const ssx = new SSX(); ssx.signIn(); }).toThrowError('An ethereum wallet extension is not installed.');
// });
