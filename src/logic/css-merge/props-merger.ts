export interface PropsMerger {
  merge(sheet: Record<string, string>): Record<string, string>;
}
