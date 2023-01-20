import { useSigner } from 'wagmi';
import { generateReactSSX } from './ssx';

const { SSXProvider, useSSX } = generateReactSSX(useSigner);
export { SSXProvider, useSSX };
