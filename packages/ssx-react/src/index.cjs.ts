import { useSigner } from 'wagmi-cjs';
import { generateReactSSX } from './ssx';

const { SSXProvider, useSSX } = generateReactSSX({ useSigner });
export { SSXProvider, useSSX };
