/** An array of bytes represented as an array of integers. */
export type Bytes = ArrayLike<number>;

/** A common interface that a wallet must implement to be compatible with this SDK.
 *
 * Wallet representations implement APIs that can be reduced to this subset of functionality. The
 * {@link https://docs.ethers.io/v5/api/signer/#Signer | Signer} from ethers is fully compatible
 * with this interface.
 */
export interface WalletProvider {
  /** Returns the account address. */
  getAddress(): Promise<string>;
  /** Returns the chain ID that this wallet is connected to. */
  getChainId(): Promise<number>;
  /** Performs a `personal_sign` on the message and returns the signature as a hex string of the
   * format `"0x<65 bytes>"`.
   */
  signMessage(message: Bytes | string): Promise<string>;
}
