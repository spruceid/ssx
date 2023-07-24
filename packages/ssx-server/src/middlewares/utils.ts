import {
  isSSXServerMiddlewareConfig,
  SSXServerRouteEndpointType,
} from '@spruceid/ssx-core';

/**
 * This receives a routeConfig param and returns the path string.
 * @param routeConfig - Route config property
 * @param defaultPath - Default path string
 * @returns a path string
 */
export const getRoutePath = (
  routeConfig: SSXServerRouteEndpointType,
  defaultPath: string,
) => {
  if (isSSXServerMiddlewareConfig(routeConfig)) {
    return routeConfig.path;
  } else if (typeof routeConfig === 'string') {
    return routeConfig;
  } else {
    return defaultPath;
  }
};
