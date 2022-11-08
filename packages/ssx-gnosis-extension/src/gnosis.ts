import {
  SiweError,
  SiweMessage,
  SiweResponse,
  VerifyOpts,
  VerifyParams,
} from 'siwe';
import {
  Contract, Event, providers, utils,
} from 'ethers';

const CONTRACT_ADDRESS = {
  mainnet: '0x469788fE6E9E9681C6ebF3bF78e7Fd26Fc015446',
  rinkeby: '0x469788fE6E9E9681C6ebF3bF78e7Fd26Fc015446',
  goerli: '0x469788fE6E9E9681C6ebF3bF78e7Fd26Fc015446',
};

const CONTRACT_ABI = [
  'event SetDelegate(address indexed delegator, bytes32 indexed id, address indexed delegate)',
  'event ClearDelegate(address indexed delegator, bytes32 indexed id, address indexed delegate)',
];

const getNetworkName = (chainId: number): string => {
  switch (chainId) {
    case 1:
      return 'mainnet';
    case 4:
      return 'rinkeby';
    case 420:
      return 'goerli';
    default:
      return 'mainnet';
  }
};

const getContractAddress = async (
  provider: providers.Provider,
): Promise<string> => provider
  .getNetwork()
  .then(({ chainId }) => CONTRACT_ADDRESS[getNetworkName(chainId)]);

export const getGnosisDelegationHistoryEventsFor = async (
  address: string,
  provider: providers.Provider,
): Promise<Array<Event>> => {
  const utf8Encode = new TextEncoder();
  const siweSpace = utils.keccak256(utf8Encode.encode(`siwe${address}`));

  const contractAddress = await getContractAddress(provider);

  const delegationHistory = new Contract(
    contractAddress,
    CONTRACT_ABI,
    provider,
  );
  const setDelegateFilter = delegationHistory.filters.SetDelegate(
    null,
    siweSpace,
    address,
  );
  const clearDelegateFilter = delegationHistory.filters.ClearDelegate(
    null,
    siweSpace,
    address,
  );

  return Promise.all([
    delegationHistory.queryFilter(setDelegateFilter),
    delegationHistory.queryFilter(clearDelegateFilter),
  ]).then((e) => e.flat().sort((a, b) => a.blockNumber - b.blockNumber));
};

export const gnosisDelegatorsFor = async (
  address: string,
  provider: providers.Provider,
): Promise<Array<string>> => {
  let delegationHistoryEvents = await getGnosisDelegationHistoryEventsFor(
    address,
    provider,
  );

  delegationHistoryEvents.forEach((clear) => {
    if (clear.event === 'ClearDelegate') {
      delegationHistoryEvents = delegationHistoryEvents
        .filter((e) => {
          if (e.event === 'SetDelegate') {
            const setEventAddress = e.topics[1];
            const clearEventAddress = clear.topics[1];
            // if clear event is not related to the compared just append it
            if (setEventAddress !== clearEventAddress) return true;
            // if clear event is related and occurred in a future block remove it
            return e.blockNumber > clear.blockNumber;
          }
          return false;
        });
    }
  });

  return Promise.resolve(
    [...new Set(delegationHistoryEvents
      .map((event) => utils.getAddress(event.topics[1].replace(/0x0+/, '0x'))))],
  );
};

export const addressIsDelegateOf = async (
  delegateAddress: string,
  delegator: string,
  provider: providers.Provider,
): Promise<boolean> => {
  const delegators = await gnosisDelegatorsFor(delegateAddress, provider);
  return delegators.includes(delegator);
};

export const SiweGnosisVerify = async (
  params: VerifyParams,
  opts: VerifyOpts,
  message: SiweMessage,
  _,
): Promise<SiweResponse> => {
  const addr = utils.verifyMessage(message.prepareMessage(), params.signature);
  const isDelegate = await addressIsDelegateOf(
    addr,
    message.address,
    opts.provider,
  );
  if (!isDelegate) {
    return {
      success: false,
      data: message,
      error: new SiweError(
        'Given address is not registered at delegee list.',
        `${addr} to be delegate of ${message.address}.`,
        `${addr} not found in delegee list of ${message.address}.`,
      ),
    };
  }
  return {
    success: true,
    data: message,
  };
};
