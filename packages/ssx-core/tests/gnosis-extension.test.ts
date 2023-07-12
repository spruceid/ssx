import { ethers, Wallet } from 'ethers';
import { SiweMessage } from 'siwe';
import { SiweGnosisVerify } from '../src';
import { GnosisDelegation } from '../src/client';

const provider = new ethers.providers.InfuraProvider(
  'goerli',
  '49a0efa3aaee4fd99797bfa94d8ce2f1'
);
const wallet = Wallet.createRandom();

test('Instantiate GnosisDelegation successfully', () => {
  expect(() => {
    const gnosisDelegation = new GnosisDelegation();
  }).not.toThrowError();
});

test('Should not verify message when there is no delegation', async () => {
  const message = new SiweMessage({
    domain: 'ssx.id',
    address: '0x9D85ca56217D2bb651b00f15e694EB7E713637D4',
    statement: 'Sign-In With Ethereum Example Statement',
    uri: 'https://ssx.id',
    version: '1',
    nonce: 'bTyXgcQxn2htgkjJn',
    chainId: 1,
    expirationTime: '2100-02-28T14:31:43.952Z',
  });
  const signature = await wallet.signMessage(message.prepareMessage());
  await message
    .verify(
      { signature },
      {
        verificationFallback: SiweGnosisVerify,
        provider,
      }
    )
    .catch(({ success, error }) => {
      expect(success).toBeFalsy();
      expect(error).not.toBeNull();
      expect(error.type).toBe(
        'Given address is not registered at delegee list.'
      );
    });
});

// TODO: test case when delegate is successfull
