import { ConfigOverrides, ISSXConnected, SSXExtension } from './types';
import { providers } from 'ethers';
import { gnosisDelegatorsFor } from '../utils';

declare global {
  interface Window {
    gnosisModal: IGnosisModal;
  }
}

let delegators: Array<string> = [];

/** Gnosis Modal Interface */
interface IGnosisModal {
  /** Method to abort operation handling an error and close the modal. */
  abortOperation: (message: string) => void;
  /** Method to close the modal. */
  closeModal: () => void;
  /** Method to open modal. */
  openModal: () => Promise<void>;
  /** Method to select delegation option on modal. */
  selectOption: (opt: any) => void;
  /** Method to connect with selected option. */
  connect: () => Promise<void>;
}

const styles =
  '.ssx-gnosis-ssx-gnosis-modal--body{font-family:Satoshi;margin:0;background-color:#000}.ssx-gnosis-modal--container{display:flex;justify-content:center;align-items:center;position:fixed;width:100%;height:100%;top:0;visibility:hidden;opacity:0;transition:all 0.3s ease}.ssx-gnosis-modal--container .ssx-gnosis-modal--backdrop{background:rgba(15,15,24,.6);position:fixed;width:100%;height:100%}.ssx-gnosis-modal--container.visible{opacity:1;visibility:visible}.ssx-gnosis-modal--container .ssx-gnosis-modal--content{max-width:100%;width:500px;position:fixed;top:calc((100vh - 550px - 120px)/2);transition:all 0.8s ease;z-index:9999}.ssx-gnosis-modal--header,.ssx-gnosis-modal--subheader,.ssx-gnosis-modal--footer{padding:1rem}.ssx-gnosis-modal--body{height:300px;overflow-y:auto}.ssx-gnosis-modal--body .ssx-gnosis-modal--option{font-size:16px;font-weight:400;padding:15px 30px;cursor:pointer}.ssx-gnosis-modal--body .ssx-gnosis-modal--info{width:100%;height:100%;display:flex;flex-wrap:wrap;text-align:center;justify-content:center;align-items:center}.ssx-gnosis-modal--body .ssx-gnosis-modal--info p{font-size:26px;font-weight:700;line-height:30px;margin-top:22px;margin-bottom:22px}.ssx-gnosis-modal--body .ssx-gnosis-modal--info a{-webkit-appearance:button;-moz-appearance:button;appearance:button;text-decoration:none;cursor:pointer;border-radius:100px;width:174px;height:45px;font-size:16px;font-weight:700;line-height:25px;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;margin:auto}.ssx-gnosis-modal--body .ssx-gnosis-modal--info a img{margin-right:12px}.ssx-gnosis-modal--body .ssx-gnosis-modal--loader{width:100%;height:100%;display:flex;flex-wrap:wrap;justify-content:center;align-items:center}.ssx-gnosis-modal--body .ssx-gnosis-modal--loader img{width:100px;height:100px}.ssx-gnosis-modal--header{display:flex;justify-content:space-between;align-items:center}.ssx-gnosis-modal--header .ssx-gnosis-modal--brand{display:flex;flex-wrap:wrap;align-items:center;justify-content:center}.ssx-gnosis-modal--header .ssx-gnosis-modal--header-title{margin-left:12px;font-size:30px;line-height:46px;font-weight:900;margin-block-start:0.67em;margin-block-end:0.67em;margin-inline-start:0px;margin-inline-end:0px}.ssx-gnosis-modal--header button{font-size:20px;padding:12px;margin:0;height:40px;width:40px;border-radius:100px;border-style:none;cursor:pointer;line-height:initial;font-family:initial}.ssx-gnosis-modal--subheader{border-top-left-radius:20px;border-top-right-radius:20px;text-align:right}.ssx-gnosis-modal--subheader .ssx-gnosis-modal--results-counter{font-size:16px;font-weight:400;line-height:25.5px}.ssx-gnosis-modal--footer{text-align:right;border-bottom-left-radius:20px;border-bottom-right-radius:20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap}.ssx-gnosis-modal--btn{display:inline-block;border:0;cursor:pointer;font-size:16px;line-height:24.5px;font-weight:700;padding:11px 25px}.ssx-gnosis-modal--btn.disabled{cursor:not-allowed;opacity:.4}.ssx-gnosis-modal-rotating{animation:ssx-gnosis-modal-rotating 0.7s linear infinite;-o-animation:ssx-gnosis-modal-rotating 0.7s linear infinite;-ms-animation:ssx-gnosis-modal-rotating 0.7s linear infinite;-moz-animation:ssx-gnosis-modal-rotating 0.7s linear infinite;-webkit-animation:ssx-gnosis-modal-rotating 0.7s linear infinite}@keyframes ssx-gnosis-modal-rotating{from{-webkit-transform:rotate(0deg)}to{-webkit-transform:rotate(360deg)}}.ssx-gnosis-modal--theme-dark{color:#fff}.ssx-gnosis-modal--theme-dark .ssx-gnosis-modal--header button{background:#fff;color:#000}.ssx-gnosis-modal--theme-dark .ssx-gnosis-modal--subheader,.ssx-gnosis-modal--theme-dark .ssx-gnosis-modal--body{background-color:#293137}.ssx-gnosis-modal--theme-dark .ssx-gnosis-modal--body .ssx-gnosis-modal--info a{background-color:#fff;color:#24262A}.ssx-gnosis-modal--theme-dark .ssx-gnosis-modal--body .ssx-gnosis-modal--info a img{filter:brightness(0) saturate(100%) invert(30%) sepia(96%) saturate(1424%) hue-rotate(147deg) brightness(90%) contrast(101%)}.ssx-gnosis-modal--theme-dark .ssx-gnosis-modal--body .ssx-gnosis-modal--loader img{filter:invert(1)}.ssx-gnosis-modal--theme-dark .ssx-gnosis-modal--body::-webkit-scrollbar-track{border-radius:20px;background-color:#3F464B}.ssx-gnosis-modal--theme-dark .ssx-gnosis-modal--body::-webkit-scrollbar-thumb{border-radius:8px;background-color:#898f94}.ssx-gnosis-modal--theme-dark .ssx-gnosis-modal--body::-webkit-scrollbar{background-color:#898f94;border-radius:20px;height:6px;width:6px}.ssx-gnosis-modal--theme-dark .ssx-gnosis-modal--body .ssx-gnosis-modal--option{background-color:transparent;border-bottom:1px solid #3F464B}.ssx-gnosis-modal--theme-dark .ssx-gnosis-modal--body .ssx-gnosis-modal--option.selected{background-color:#24262A}.ssx-gnosis-modal--theme-dark .ssx-gnosis-modal--body .ssx-gnosis-modal--option:hover{background-color:#24262A}.ssx-gnosis-modal--theme-dark .ssx-gnosis-modal--footer{background-color:#3F464B}.ssx-gnosis-modal--theme-dark .ssx-gnosis-modal--subheader{border-bottom:1px solid #3F464B}.ssx-gnosis-modal--theme-dark .ssx-gnosis-modal--footer{border-top:1px solid #3F464B}.ssx-gnosis-modal--theme-dark .ssx-gnosis-modal--btn.secondary{background:transparent;color:#ccc}.ssx-gnosis-modal--theme-dark .ssx-gnosis-modal--btn.primary{border-radius:8px;background:#656B6F;color:#fff}';

/**
 * Gets modal loader component.
 * @returns Modal Loader HTML element.
 */
const getModalLoader = (): Element => {
  const loader = document.createElement('div');
  loader.classList.add('ssx-gnosis-modal--loader');

  const container = document.createElement('div');
  container.classList.add('ssx-gnosis-modal-rotating');
  container.style.width = '72px';
  container.style.height = '72px';

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 71 71');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('preserveAspectRatio', 'xMidYMin meet');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('fill-rule', 'evenodd');
  path.setAttribute('clip-rule', 'evenodd');
  path.setAttribute(
    'd',
    'M64.5826 55.8581C68.7596 49.8911 71 42.7837 71 35.5H60.9953C60.9984 35.6663 61 35.8329 61 36C61 50.3594 49.3594 62 35 62C20.6406 62 8.99998 50.3594 8.99998 36C8.99998 21.6406 20.6406 9.99997 35 9.99997C36.6709 9.99997 38.3049 10.1576 39.8881 10.4588L41.6275 0.532786C34.4531 -0.724421 27.0656 0.255616 20.4672 3.33995C13.8688 6.42429 8.37882 11.4636 4.74198 17.7744C1.10514 24.0851 -0.502507 31.3619 0.13711 38.6174C0.776726 45.873 3.63265 52.7562 8.31747 58.3333C13.0023 63.9105 19.2893 67.9116 26.3255 69.794C33.3618 71.6764 40.8068 71.3489 47.6505 68.8559C54.4943 66.3629 60.4056 61.8251 64.5826 55.8581Z'
  );
  path.setAttribute('fill', 'black');
  svg.appendChild(path);

  container.appendChild(svg);

  loader.appendChild(container);

  return loader;
};

/**
 * Gets error component.
 * @returns Modal Error HTML element.
 */
/* c8 ignore start */
const getErrorModal = (): Element => {
  const info = document.createElement('div');
  info.classList.add('ssx-gnosis-modal--info');

  const container = document.createElement('div');

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttributeNS(
    'http://www.w3.org/2000/svg',
    'xlink',
    'http://www.w3.org/1999/xlink'
  );
  svg.setAttribute('width', '100');
  svg.setAttribute('height', '100');
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.setAttribute('fill', 'none');
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('width', '100');
  rect.setAttribute('height', '100');
  rect.setAttribute('fill', 'url(#pattern0)');
  rect.setAttribute('fill-opacity', '0.25');
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const pattern = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'pattern'
  );
  pattern.setAttribute('id', 'pattern0');
  pattern.setAttribute('patternContentUnits', 'objectBoundingBox');
  pattern.setAttribute('width', '1');
  pattern.setAttribute('height', '1');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttributeNS(
    'http://www.w3.org/1999/xlink',
    'xlink:href',
    '#image0_36_1642'
  );
  use.setAttribute('transform', 'scale(0.00195312)');
  pattern.appendChild(use);
  const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
  image.setAttribute('id', 'image0_36_1642');
  image.setAttribute('width', '512');
  image.setAttribute('height', '512');
  image.setAttributeNS(
    'http://www.w3.org/1999/xlink',
    'xlink:href',
    'data:image/png;base64,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'
  );
  defs.appendChild(pattern);
  defs.appendChild(image);
  svg.appendChild(rect);
  svg.appendChild(defs);

  const p = document.createElement('p');
  p.appendChild(document.createTextNode('Oops something went'));
  p.appendChild(document.createElement('br'));
  p.appendChild(document.createTextNode('wrong!'));

  container.appendChild(svg);
  container.appendChild(p);
  info.appendChild(container);

  return info;
};
/* c8 ignore end */

/**
 * Gets base modal component.
 * @returns Base Modal HTML element.
 */
const getBaseModal = (): Element => {
  const container = document.createElement('div');
  container.classList.add(
    'ssx-gnosis-modal--container',
    'ssx-gnosis-modal--theme-dark'
  );

  // Backdrop
  const backdrop = document.createElement('span');
  backdrop.classList.add('ssx-gnosis-modal--backdrop');
  backdrop.onclick = () =>
    window.gnosisModal.abortOperation('Operation aborted by the user.');
  container.appendChild(backdrop);

  // Brand
  const brand = document.createElement('div');
  brand.classList.add('ssx-gnosis-modal--brand');
  const svgLogo = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgLogo.setAttribute('width', '50');
  svgLogo.setAttribute('height', '50');
  svgLogo.setAttribute('viewBox', '0 0 400 400');
  svgLogo.setAttribute('fill', 'none');
  svgLogo.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  const gLogo = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  gLogo.setAttribute(
    'transform',
    'translate(0.000000,400.000000) scale(0.100000,-0.100000)'
  );
  gLogo.setAttribute('fill', '#ffffff');
  gLogo.setAttribute('stroke', 'none');
  const pathLogo1 = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'path'
  );
  pathLogo1.setAttribute(
    'd',
    'M1331 3248 c-70 -36 -81 -67 -81 -231 0 -125 -2 -143 -22 -178 -36 -65 -79 -79 -239 -79 -160 0 -191 -11 -226 -80 -22 -42 -23 -54 -23 -295 0 -225 2 -254 20 -292 34 -76 57 -83 270 -83 166 0 188 2 217 20 63 38 67 58 73 330 6 272 8 282 73 317 29 17 78 18 615 20 661 2 627 -2 670 83 20 40 22 58 22 200 0 142 -2 160 -22 200 -13 24 -36 53 -51 64 -28 21 -41 21 -640 24 l-612 2 -44 -22z'
  );
  const pathLogo2 = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'path'
  );
  pathLogo2.setAttribute(
    'd',
    'M1815 2286 c-41 -18 -83 -69 -90 -109 -4 -18 -5 -105 -3 -194 3 -176 7 -189 72 -237 25 -19 41 -21 209 -21 208 0 233 7 271 80 19 36 21 57 21 210 0 160 -1 172 -23 207 -41 66 -84 78 -268 78 -109 -1 -168 -5 -189 -14z'
  );
  const pathLogo3 = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'path'
  );
  pathLogo3.setAttribute(
    'd',
    'M2770 1991 c-19 -10 -45 -36 -57 -57 -22 -37 -23 -49 -23 -275 0 -228 -1 -237 -22 -269 -13 -18 -39 -41 -58 -51 -33 -18 -69 -19 -608 -19 -559 0 -574 -1 -613 -21 -67 -34 -79 -73 -79 -264 0 -147 2 -165 23 -205 41 -84 9 -80 702 -80 693 0 659 -4 703 80 20 40 22 59 22 185 0 121 3 144 20 172 32 53 59 60 225 65 168 4 201 14 235 71 19 30 20 52 20 311 l0 279 -26 34 c-44 58 -64 63 -256 63 -150 0 -178 -3 -208 -19z'
  );
  gLogo.appendChild(pathLogo1);
  gLogo.appendChild(pathLogo2);
  gLogo.appendChild(pathLogo3);
  svgLogo.appendChild(gLogo);
  const divSafe = document.createElement('div');
  divSafe.classList.add('ssx-gnosis-modal--header-title');
  divSafe.appendChild(document.createTextNode('Safe'));
  brand.appendChild(svgLogo);
  brand.appendChild(divSafe);
  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.onclick = () =>
    window.gnosisModal.abortOperation('Operation aborted by the user.');
  const svgClose = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'svg'
  );
  svgClose.setAttribute('width', '16');
  svgClose.setAttribute('height', '16');
  svgClose.setAttribute('viewBox', '0 0 16 16');
  svgClose.setAttribute('fill', 'none');
  const pathClose = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'path'
  );
  pathClose.setAttribute(
    'd',
    'M14.0557 0.416504L7.99984 6.47234L1.944 0.416504L0.416504 1.944L6.47234 7.99984L0.416504 14.0557L1.944 15.5832L7.99984 9.52734L14.0557 15.5832L15.5832 14.0557L9.52734 7.99984L15.5832 1.944L14.0557 0.416504Z'
  );
  pathClose.setAttribute('fill', '#454545');
  svgClose.appendChild(pathClose);
  closeBtn.appendChild(svgClose);
  // Header
  const header = document.createElement('div');
  header.classList.add('ssx-gnosis-modal--header');
  header.appendChild(brand);
  header.appendChild(closeBtn);

  // Subheader
  const subheader = document.createElement('div');
  subheader.classList.add('ssx-gnosis-modal--subheader');
  // Counter
  const counter = document.createElement('span');
  counter.classList.add('ssx-gnosis-modal--results-counter');
  subheader.appendChild(counter);

  // Body
  const body = document.createElement('div');
  body.classList.add('ssx-gnosis-modal--body');

  // Close button
  const footerCloseBtn = document.createElement('button');
  footerCloseBtn.classList.add('ssx-gnosis-modal--btn', 'secondary');
  footerCloseBtn.onclick = () =>
    window.gnosisModal.abortOperation('Operation aborted by the user.');
  footerCloseBtn.appendChild(document.createTextNode('Cancel'));
  // Continue button
  const continueBtn = document.createElement('button');
  continueBtn.setAttribute('id', 'ssx-gnosis-modal--continue-btn');
  continueBtn.classList.add('ssx-gnosis-modal--btn', 'primary', 'disabled');
  continueBtn.onclick = window.gnosisModal.connect;
  continueBtn.appendChild(document.createTextNode('Continue'));
  // Footer
  const footer = document.createElement('div');
  footer.classList.add('ssx-gnosis-modal--footer');
  footer.appendChild(footerCloseBtn);
  footer.appendChild(continueBtn);

  // Content
  const content = document.createElement('div');
  content.classList.add('ssx-gnosis-modal--content');
  content.appendChild(header);
  content.appendChild(subheader);
  content.appendChild(body);
  content.appendChild(footer);
  container.appendChild(content);

  return container;
};
/**
 * GnosisDelegation is an SSX Extension to enable multisig login on SSX.
 */
export class GnosisDelegation implements SSXExtension {
  /** Web3 Provider. */
  public web3provider: providers.Web3Provider;
  /** Selected delegation option.  */
  public selectedOption = '';
  /** Continue with the SSX flow with a successfull promise. */
  private _proceed: (
    value: ConfigOverrides | PromiseLike<ConfigOverrides>
  ) => void;
  /** Continue with the SSX flow with a rejected promise. */
  private _failure: (reason?: any) => void;
  /** User address without delegation. */
  private _connectedAddress: string;

  namespace = 'delegationRegistry';

  /**
   * Executes extension logic.
   * @param ssx - SSXConnected instance.
   * @returns Promise with extension status.
   */
  async afterConnect(ssx: ISSXConnected): Promise<ConfigOverrides> {
    this.web3provider = ssx.provider;
    this._connectedAddress = await ssx.provider.getSigner().getAddress();

    const gnosisModal = {
      abortOperation: this.abortOperation,
      closeModal: this.closeModal,
      selectOption: this.selectOption,
      openModal: this.openModal,
      connect: this.connect,
    };

    window.gnosisModal = gnosisModal;
    return new Promise<ConfigOverrides>((resolve, reject) => {
      this.openModal();
      this._proceed = resolve;
      this._failure = reject;
    });
  }

  /**
   * Opens GnosisModal.
   */
  openModal = async (): Promise<void> => {
    this.selectedOption = '';
    const { modal, modalBody, modalCounter, continueBtn } = this.getTags();
    modalBody.replaceChildren(getModalLoader());
    modalCounter.textContent = '';
    modalCounter.insertAdjacentHTML('beforeend', '&nbsp;');
    continueBtn.classList.add('disabled');
    const modalBodyContent = document.createElement('div');
    await this.getOptions()
      .then(async options => {
        delegators = options;
        this.selectedOption = `Yourself - ${this._connectedAddress}`;
        if (options.length === 0) {
          this.connect();
          return;
        }
        return Promise.all(
          [this._connectedAddress, ...options].map(add =>
            this.web3provider.lookupAddress(add)
          )
        )
          .then(ensNames => {
            [this.selectedOption, ...options].forEach((option, index) => {
              const newOption = document.createElement('div');
              newOption.setAttribute(
                'id',
                `ssx-gnosis-modal--option-${option}`
              );
              newOption.classList.add('ssx-gnosis-modal--option');
              newOption.onclick = () => window.gnosisModal.selectOption(option);
              newOption.textContent = ensNames[index] || option;
              modalBodyContent.appendChild(newOption);
            });
            modalBody.replaceChildren(modalBodyContent);
            modalCounter.textContent = `${options.length} result${
              options.length > 1 ? 's' : ''
            }`;
            modal.classList.add('visible');
          })
          .catch(e => {
            console.error(e);

            [this.selectedOption, ...options].forEach(option => {
              const newOption = document.createElement('div');
              newOption.setAttribute(
                'id',
                `ssx-gnosis-modal--option-${option}`
              );
              newOption.classList.add('ssx-gnosis-modal--option');
              newOption.onclick = () => window.gnosisModal.selectOption(option);
              newOption.textContent = option;
              modalBodyContent.appendChild(newOption);
            });
            modalBody.replaceChildren(modalBodyContent);
            modalCounter.textContent = `${options.length} result${
              options.length > 1 ? 's' : ''
            }`;
            if (!modal.classList.contains('visible')) {
              modal.classList.add('visible');
            }
          });
      })
      .catch(e => {
        console.error(e);
        modalBody.replaceChildren(getErrorModal());
        if (!modal.classList.contains('visible')) {
          modal.classList.add('visible');
        }
      });
  };

  /**
   * Gets static HTML tags to build the main component.
   * @returns JSON with static HTML tags.
   */
  getTags = (): Record<string, Element> => {
    // append modal to the body
    const modalWrapper = document.createElement('div');
    modalWrapper.setAttribute('id', 'ssx-gnosis-modal--wrapper');
    modalWrapper.replaceChildren(getBaseModal());
    document.querySelector('body').appendChild(modalWrapper);

    // create style tag
    const styleTag = document.createElement('style');
    styleTag.textContent = styles;

    // append style tag to the head
    document.querySelector('head').appendChild(styleTag);

    // get tags to return
    const modal = document.querySelector('.ssx-gnosis-modal--container');
    const modalBody = document.querySelector('.ssx-gnosis-modal--body');
    const modalCounter = document.querySelector(
      '.ssx-gnosis-modal--results-counter'
    );
    const continueBtn = document.querySelector(
      '#ssx-gnosis-modal--continue-btn'
    );
    return {
      modal,
      modalBody,
      modalCounter,
      continueBtn,
    };
  };

  /**
   * Gets delegators.
   * @returns List of delegators.
   */
  getOptions = async (): Promise<Array<string>> =>
    gnosisDelegatorsFor(this._connectedAddress, this.web3provider);

  /**
   * Selects delegation option.
   * @param option - Modal option.
   */
  selectOption = (option): void => {
    document
      .getElementById(`ssx-gnosis-modal--option-${this.selectedOption}`)
      .classList.remove('selected');
    document
      .getElementById('ssx-gnosis-modal--continue-btn')
      .classList.remove('disabled');
    this.selectedOption = option;
    document
      .getElementById(`ssx-gnosis-modal--option-${option}`)
      .classList.add('selected');
  };

  /**
   * Abort operation and close Modal.
   */
  abortOperation = (message: string): void => {
    this._failure(new Error(message));
    this.closeModal();
  };

  /**
   * Closes Modal.
   */
  closeModal = (): void => {
    document.getElementById('ssx-gnosis-modal--wrapper').remove();
  };

  /**
   * Confirm selection and continue SSX flow.
   * @returns Promise void.
   */
  connect = async (): Promise<void> => {
    const option = this.selectedOption.replace(/Yourself - /, '');
    const hasDelegator =
      [...delegators, this._connectedAddress].filter(
        delegator => option === delegator
      ).length !== 1;
    if (!option || hasDelegator) {
      this._failure(new Error('Invalid address selected.'));
      this.closeModal();
      return;
    }
    this.closeModal();
    this._proceed({
      siwe: { address: option },
    });
    return;
  };
}
