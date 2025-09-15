export class BaselineElementStyles {
  static #elements = new Map();

  /**
   * @param {any} node
   * @returns {{[key: string]: any}}
   * */
  static getUniqueStylesForTag(node) {
    const defaultStyle = this.#getDefaultStylesForTag(node.tagName);
    const currentStyle = window.getComputedStyle(node);
    const nonDefaultStyles = {};

    for (let i = 0; i < currentStyle.length; i++) {
      const prop = currentStyle[i];
      const value = currentStyle.getPropertyValue(prop);
      const defaultValue = defaultStyle.getPropertyValue(prop);

      if (value !== defaultValue) {
        nonDefaultStyles[prop] = value;
      }
    }

    return nonDefaultStyles;
  }

  /**
   * @param {string} tagName
   * @returns {CSSStyleDeclaration}
   * */
  static #getDefaultStylesForTag(tagName) {
    const styles = this.#elements.get(tagName);

    if (styles !== undefined) {
      return styles;
    }

    const element = document.createElement(tagName);
    document.body.appendChild(element);

    const defaultComputed = window.getComputedStyle(element);
    this.#elements.set(tagName, defaultComputed);

    document.body.removeChild(element);

    return defaultComputed;
  }
}
