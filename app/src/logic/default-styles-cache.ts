export class DefaultStylesCache {
  private static _instance: DefaultStylesCache;

  private stylesByTag = new Map<string, Record<string, string>>();
  private iframe: HTMLIFrameElement | null = null;

  static get instance(): DefaultStylesCache {
    DefaultStylesCache._instance ??= new DefaultStylesCache();
    return DefaultStylesCache._instance;
  }

  private constructor() {}

  startGathering(): void {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    this.iframe = iframe;
  }

  stopGathering(): void {
    this.iframe?.remove();
    this.iframe = null;
  }

  getFor(selector: string): Record<string, string> {
    if (this.stylesByTag.has(selector)) {
      return this.stylesByTag.get(selector)!;
    }

    if (!this.iframe) {
      throw new Error("IFrame not initalized.");
    }

    const defaultEl = document.createElement(selector);
    this.iframe.contentDocument!.body.appendChild(defaultEl);

    const defaultStyle = this.iframe.contentWindow!.getComputedStyle(defaultEl);
    const styleRecord = this.cssToRecord(defaultStyle);

    this.stylesByTag.set(selector, styleRecord);

    return styleRecord;
  }

  private cssToRecord(style: CSSStyleDeclaration): Record<string, string> {
    return Object.fromEntries(
      Array.from(style).map((prop) => [prop, style.getPropertyValue(prop)])
    );
  }
}
