import type { AnimalRouteResult } from "./qr-route";
import { parseAnimalFromUrl } from "./qr-route";

export function interpretScanResult(
  payload: string,
  knownAnimalIds: string[],
): AnimalRouteResult {
  return parseAnimalFromUrl(payload, knownAnimalIds);
}
