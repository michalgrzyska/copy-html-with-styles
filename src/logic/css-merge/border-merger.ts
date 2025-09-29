import { PropsMerger } from "./props-merger.js";

export class BorderMerger implements PropsMerger {
  merge(styles: Record<string, string>): Record<string, string> {
    const merged: Record<string, string> = { ...styles };

    // Prefer logical props if both exist
    const hasLogical = Object.keys(styles).some(
      (k) => k.startsWith("border-block") || k.startsWith("border-inline"),
    );

    if (hasLogical) {
      this.mergeLogicalBorders(styles, merged);
    } else {
      this.mergePhysicalBorders(styles, merged);
    }

    this.mergeBorderRadius(styles, merged);

    return merged;
  }

  private mergePhysicalBorders(styles: Record<string, string>, merged: Record<string, string>) {
    const sides = ["top", "right", "bottom", "left"] as const;

    const widths: Record<(typeof sides)[number], string | undefined> = {} as any;
    const stylesMap: Record<(typeof sides)[number], string | undefined> = {} as any;
    const colors: Record<(typeof sides)[number], string | undefined> = {} as any;

    for (const side of sides) {
      widths[side] = styles[`border-${side}-width`];
      stylesMap[side] = styles[`border-${side}-style`];
      colors[side] = styles[`border-${side}-color`];
    }

    const definedWidths = sides.filter((s) => widths[s] !== undefined);
    const definedStyles = sides.filter((s) => stylesMap[s] !== undefined);
    const definedColors = sides.filter((s) => colors[s] !== undefined);

    const allWidthsSame =
      definedWidths.length === 4 &&
      definedWidths.every((s) => widths[s] === widths[definedWidths[0]]);
    const allStylesSame =
      definedStyles.length === 4 &&
      definedStyles.every((s) => stylesMap[s] === stylesMap[definedStyles[0]]);
    const allColorsSame =
      definedColors.length === 4 &&
      definedColors.every((s) => colors[s] === colors[definedColors[0]]);

    if (allWidthsSame && allStylesSame && allColorsSame) {
      merged["border"] = `${widths["top"]} ${stylesMap["top"]} ${colors["top"]}`;
      for (const side of sides) {
        delete merged[`border-${side}-width`];
        delete merged[`border-${side}-style`];
        delete merged[`border-${side}-color`];
      }
    } else {
      if (allWidthsSame) {
        merged["border-width"] = widths["top"]!;
        for (const side of sides) delete merged[`border-${side}-width`];
      }
      if (allStylesSame) {
        merged["border-style"] = stylesMap["top"]!;
        for (const side of sides) delete merged[`border-${side}-style`];
      }
      if (allColorsSame) {
        merged["border-color"] = colors["top"]!;
        for (const side of sides) delete merged[`border-${side}-color`];
      }
    }
  }

  private mergeLogicalBorders(styles: Record<string, string>, merged: Record<string, string>) {
    // Block (start/end)
    const blockProps = ["start", "end"] as const;
    const inlineProps = ["start", "end"] as const;

    const blockWidths = blockProps.map((pos) => styles[`border-block-${pos}-width`]);
    const blockStyles = blockProps.map((pos) => styles[`border-block-${pos}-style`]);
    const blockColors = blockProps.map((pos) => styles[`border-block-${pos}-color`]);

    const inlineWidths = inlineProps.map((pos) => styles[`border-inline-${pos}-width`]);
    const inlineStyles = inlineProps.map((pos) => styles[`border-inline-${pos}-style`]);
    const inlineColors = inlineProps.map((pos) => styles[`border-inline-${pos}-color`]);

    // Check if block widths/styles/colors are uniform
    const blockWidthSame = blockWidths.every((v) => v && v === blockWidths[0]);
    const blockStyleSame = blockStyles.every((v) => v && v === blockStyles[0]);
    const blockColorSame = blockColors.every((v) => v && v === blockColors[0]);

    if (blockWidthSame && blockStyleSame && blockColorSame) {
      merged["border-block"] = `${blockWidths[0]} ${blockStyles[0]} ${blockColors[0]}`;
      blockProps.forEach((p) => {
        delete merged[`border-block-${p}-width`];
        delete merged[`border-block-${p}-style`];
        delete merged[`border-block-${p}-color`];
      });
    }

    // Check if inline widths/styles/colors are uniform
    const inlineWidthSame = inlineWidths.every((v) => v && v === inlineWidths[0]);
    const inlineStyleSame = inlineStyles.every((v) => v && v === inlineStyles[0]);
    const inlineColorSame = inlineColors.every((v) => v && v === inlineColors[0]);

    if (inlineWidthSame && inlineStyleSame && inlineColorSame) {
      merged["border-inline"] = `${inlineWidths[0]} ${inlineStyles[0]} ${inlineColors[0]}`;
      inlineProps.forEach((p) => {
        delete merged[`border-inline-${p}-width`];
        delete merged[`border-inline-${p}-style`];
        delete merged[`border-inline-${p}-color`];
      });
    }

    // If block and inline are both uniform → full `border`
    if (
      merged["border-block"] &&
      merged["border-inline"] &&
      merged["border-block"] === merged["border-inline"]
    ) {
      merged["border"] = merged["border-block"];
      delete merged["border-block"];
      delete merged["border-inline"];
    }
  }

  private mergeBorderRadius(styles: Record<string, string>, merged: Record<string, string>) {
    const corners = ["top-left", "top-right", "bottom-right", "bottom-left"] as const;
    const radii: (string | undefined)[] = corners.map((c) => styles[`border-${c}-radius`]);
    const definedRadii = radii.filter(Boolean);

    if (definedRadii.length === 4 && definedRadii.every((r) => r === definedRadii[0])) {
      merged["border-radius"] = definedRadii[0]!;
      corners.forEach((c) => delete merged[`border-${c}-radius`]);
    } else if (definedRadii.length === 4) {
      merged["border-radius"] = radii.map((r) => r || "0").join(" ");
      corners.forEach((c) => delete merged[`border-${c}-radius`]);
    }
  }
}
