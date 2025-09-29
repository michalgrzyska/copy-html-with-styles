import { BorderMerger } from "./border-merger.js";
import { PropsMerger } from "./props-merger.js";

const MERGERS: PropsMerger[] = [new BorderMerger()];

export class CssMerger {
  merge(sheet: Record<string, string>): Record<string, string> {
    let result = sheet;

    MERGERS.forEach((x) => {
      result = x.merge(result);
    });

    return result;
  }
}
