import {
  getProvider,
  SSXRPCProvider,
  SSXRPCProviders,
  ssxResolveEns,
  ssxResolveLens,
  SSXInfuraProviderNetworks,
} from '../src';

const ssxRPCProviders: Record<string, SSXRPCProvider> = {
  etherscan: {
    service: SSXRPCProviders.SSXEtherscanProvider,
  },
  infura: {
    service: SSXRPCProviders.SSXInfuraProvider,
  },
  alchemy: {
    service: SSXRPCProviders.SSXAlchemyProvider,
  },
  cloudflare: {
    service: SSXRPCProviders.SSXCloudflareProvider,
  },
  pocket: {
    service: SSXRPCProviders.SSXPocketProvider,
  },
  ankr: {
    service: SSXRPCProviders.SSXAnkrProvider,
  },
  custom: {
    service: SSXRPCProviders.SSXCustomProvider,
  },
};

test('Should get Etherscan Provider successfully', () => {
  let provider;
  expect(() => {
    provider = getProvider(ssxRPCProviders.etherscan);
  }).not.toThrowError();

  expect(provider.baseUrl).toEqual('https://api.etherscan.io');
});

test('Should get Infura Provider successfully', () => {
  let provider;
  expect(() => {
    provider = getProvider(ssxRPCProviders.infura);
  }).not.toThrowError();

  expect(provider.connection).toEqual(
    expect.objectContaining({
      url: 'https://mainnet.infura.io/v3/84842078b09946638c03157f83405213',
    })
  );
});

test('Should get Alchemy Provider successfully', () => {
  let provider;
  expect(() => {
    provider = getProvider(ssxRPCProviders.alchemy);
  }).not.toThrowError();

  expect(provider.connection).toEqual(
    expect.objectContaining({
      url: 'https://eth-mainnet.alchemyapi.io/v2/_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC',
    })
  );
});

test('Should get Cloudflare Provider successfully', () => {
  let provider;
  expect(() => {
    provider = getProvider(ssxRPCProviders.cloudflare);
  }).not.toThrowError();

  expect(provider.connection).toEqual(
    expect.objectContaining({
      url: 'https://cloudflare-eth.com/',
    })
  );
});

test('Should get Poket Provider successfully', () => {
  let provider;
  expect(() => {
    provider = getProvider(ssxRPCProviders.pocket);
  }).not.toThrowError();

  expect(provider.connection).toEqual(
    expect.objectContaining({
      url: 'https://eth-mainnet.gateway.pokt.network/v1/lb/62e1ad51b37b8e00394bda3b',
    })
  );
});

test('Should get Ankr Provider successfully', () => {
  let provider;
  expect(() => {
    provider = getProvider(ssxRPCProviders.ankr);
  }).not.toThrowError();

  expect(provider.connection).toEqual(
    expect.objectContaining({
      url: 'https://rpc.ankr.com/eth/9f7d929b018cdffb338517efa06f58359e86ff1ffd350bc889738523659e7972',
    })
  );
});

test('Should get Custom Provider successfully', () => {
  let provider;
  expect(() => {
    provider = getProvider(ssxRPCProviders.custom);
  }).not.toThrowError();

  expect(provider.connection).toEqual(
    expect.objectContaining({
      url: 'http://localhost:8545',
    })
  );
});

test('Should get default Provider successfully', () => {
  let provider;
  expect(() => {
    provider = getProvider();
  }).not.toThrowError();
});

test('Should fail to resolve ENS domain', async () => {
  const provider = getProvider(ssxRPCProviders.goerli);
  await expect(ssxResolveEns(provider, '')).rejects.toThrow();
}, 30000);

test('Should resolve ENS domain successfully', async () => {
  const provider = getProvider(ssxRPCProviders.goerli);
  await expect(
    ssxResolveEns(provider, '0x96F7fB7ed32640d9D3a982f67CD6c09fc53EBEF1', {
      domain: true,
      avatar: false,
    })
  ).resolves.not.toThrow();
}, 30000);

test('Should resolve ENS avatar successfully', async () => {
  const provider = getProvider(ssxRPCProviders.goerli);
  await expect(
    ssxResolveEns(provider, '0x96F7fB7ed32640d9D3a982f67CD6c09fc53EBEF1', {
      domain: false,
      avatar: true,
    })
  ).resolves.not.toThrow();
}, 30000);

test('Should resolve ENS domain and avatar successfully', async () => {
  const provider = getProvider(ssxRPCProviders.goerli);
  await expect(
    ssxResolveEns(provider, '0x96F7fB7ed32640d9D3a982f67CD6c09fc53EBEF1', {
      domain: true,
      avatar: true,
    })
  ).resolves.not.toThrow();
}, 30000);

test('Should fail requesting Lens profile', async () => {
  const provider = getProvider({
    service: SSXRPCProviders.SSXInfuraProvider,
    network: SSXInfuraProviderNetworks.POLYGON,
  });

  await expect(
    ssxResolveLens(provider, '0x96F7fB7ed32640d9D3a982f67CD6c09fc53EBEF111')
  ).rejects.toThrow();
});

test('Should resolve Lens profile on Mainnet with a message advertising about the network', async () => {
  const provider = getProvider(ssxRPCProviders.infura);

  await expect(
    ssxResolveLens(provider, '0x96F7fB7ed32640d9D3a982f67CD6c09fc53EBEF1')
  ).resolves.toEqual(
    `Can't resolve Lens to 0x96F7fB7ed32640d9D3a982f67CD6c09fc53EBEF1 on network 'homestead'. Use 'matic' (Polygon) or 'maticmum' (Mumbai) instead.`
  );
}, 30000);

test('Should resolve Lens profile on Polygon Mainnet successfully', async () => {
  const provider = getProvider({
    service: SSXRPCProviders.SSXInfuraProvider,
    network: SSXInfuraProviderNetworks.POLYGON,
  });

  await expect(
    ssxResolveLens(provider, '0x96F7fB7ed32640d9D3a982f67CD6c09fc53EBEF1')
  ).resolves.toEqual(
    expect.objectContaining({
      pageInfo: expect.objectContaining({
        prev: '{"offset":0}',
        next: '{"offset":1}',
      }),
    })
  );
}, 30000);

// api-mumbai.lens.dev isn't available anymore (there is now a v2 version)
test.skip('Should resolve Lens profile on Mumbai Testnet successfully', async () => {
  const provider = getProvider({
    service: SSXRPCProviders.SSXInfuraProvider,
    network: SSXInfuraProviderNetworks.POLYGON_MUMBAI,
  });

  await expect(
    ssxResolveLens(provider, '0x96F7fB7ed32640d9D3a982f67CD6c09fc53EBEF1')
  ).resolves.toEqual(
    expect.objectContaining({
      pageInfo: expect.objectContaining({
        prev: '{"offset":0}',
        next: null,
      }),
    })
  );
}, 30000);
