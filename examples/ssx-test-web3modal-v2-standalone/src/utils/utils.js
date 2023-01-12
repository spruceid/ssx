import { DEFAULT_CHAINS } from "./constants";

export const getAllChainNamespaces = () => {
  const namespaces = [];
  DEFAULT_CHAINS.forEach(chainId => {
    const [namespace] = chainId.split(":");
    if (!namespaces.includes(namespace)) {
      namespaces.push(namespace);
    }
  });
  return namespaces;
};