import NodeCache from "node-cache";

export const cacheService = new NodeCache({
  stdTTL: 3600, // Cache for 1 hour
  checkperiod: 120
});
