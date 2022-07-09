import { x64 } from "murmurhash3js";

export function getVisitorId(userAgent: string, ip: string) {
  // A unique id used to identify the users visiting and using the different websites.
  return x64.hash128([userAgent, ip].filter((x) => x != undefined).join("~~~"));
}
