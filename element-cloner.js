/**
 * Element Clone Library - A utility library for cloning HTML elements with scroll limits removed
 * @version 1.0.0
 * @author Quy Vu
 */

class ElementCloner {
  /**
   * Check if an element has a specific CSS property set
   * @param {HTMLElement} element - The element to check
   * @param {string} property - The CSS property to check (e.g., 'height', 'width', 'background-color')
   * @returns {boolean} - True if property is set, false otherwise
   */
  static checkStyleSeted(element, property) {
    if (!element || !property) {
      return false;
    }

    const inlineValue = element.style[property];
    const hasInlineStyle =
      inlineValue && inlineValue !== "" && inlineValue !== "auto";

    if (hasInlineStyle) {
      return true;
    }

    let hasCSSStyle = false;
    const styleSheets = document.styleSheets;

    for (let i = 0; i < styleSheets.length; i++) {
      try {
        const rules = styleSheets[i].cssRules || styleSheets[i].rules;

        for (let j = 0; j < rules.length; j++) {
          const rule = rules[j];

          if (rule.selectorText) {
            if (element.matches(rule.selectorText)) {
              if (
                rule.style[property] &&
                rule.style[property] !== "auto" &&
                rule.style[property] !== ""
              ) {
                hasCSSStyle = true;
                break;
              }
            }
          }
        }

        if (hasCSSStyle) break;
      } catch (e) {
        // Skip external stylesheets that might cause CORS errors
        continue;
      }
    }

    return hasCSSStyle;
  }

  /**
   * Remove scroll limits from element and all its children
   * @param {HTMLElement} element - The element to process
   */
  static removeScrollLimits(element) {
    // Remove scroll limits from current element
    element.style.maxHeight = "unset";
    element.style.overflowY = "visible";
    element.style.overflow = "visible";

    // Recursively apply to all children
    const children = element.children;
    for (let i = 0; i < children.length; i++) {
      ElementCloner.removeScrollLimits(children[i]);
    }
  }

  /**
   * Clone element and remove scroll limits
   * @param {string|HTMLElement} target - Element ID or HTMLElement to clone
   * @param {Object} options - Clone options
   * @returns {HTMLElement} - Cloned element with scroll limits removed
   */
  static cloneElement(target, options = {}) {
    const element =
      typeof target === "string" ? document.getElementById(target) : target;
    if (!element) {
      throw new Error("Element not found");
    }

    // Clone the element
    const clonedElement = element.cloneNode(true);

    // Apply modified styles to cloned element and all its children
    ElementCloner.removeScrollLimits(clonedElement);

    // Apply positioning options
    if (options.position === "off-screen") {
      clonedElement.style.position = "absolute";
      clonedElement.style.left = "-9999px";
      clonedElement.style.top = "0";
      clonedElement.style.zIndex = "-1";
    } else if (options.position === "visible") {
      clonedElement.style.position = "relative";
      clonedElement.style.display = "block";
    }

    // Apply additional styles if provided
    if (options.styles) {
      Object.assign(clonedElement.style, options.styles);
    }

    return clonedElement;
  }

  /**
   * Clone element and add to DOM temporarily
   * @param {string|HTMLElement} target - Element ID or HTMLElement to clone
   * @param {Object} options - Clone options
   * @returns {Object} - Object containing cloned element and cleanup function
   */
  static cloneAndAddToDOM(target, options = {}) {
    const clonedElement = ElementCloner.cloneElement(target, {
      position: "off-screen",
      ...options,
    });

    // Add cloned element to body
    document.body.appendChild(clonedElement);

    // Return object with element and cleanup function
    return {
      element: clonedElement,
      remove: () => {
        if (document.body.contains(clonedElement)) {
          document.body.removeChild(clonedElement);
        }
      },
      getDimensions: () => ({
        width: clonedElement.scrollWidth,
        height: clonedElement.scrollHeight,
        offsetWidth: clonedElement.offsetWidth,
        offsetHeight: clonedElement.offsetHeight,
      }),
    };
  }

  /**
   * Get element dimensions after removing scroll limits
   * @param {string|HTMLElement} target - Element ID or HTMLElement
   * @returns {Object} - Object with width and height
   */
  static getFullDimensions(target) {
    const clonedElement = ElementCloner.cloneElement(target, { position: "off-screen" });
    document.body.appendChild(clonedElement);

    const dimensions = {
      width: clonedElement.scrollWidth,
      height: clonedElement.scrollHeight,
      offsetWidth: clonedElement.offsetWidth,
      offsetHeight: clonedElement.offsetHeight,
    };

    document.body.removeChild(clonedElement);
    return dimensions;
  }

  /**
   * Check if element has scroll limits
   * @param {string|HTMLElement} target - Element ID or HTMLElement
   * @returns {Object} - Object with scroll limit information
   */
  static checkScrollLimits(target) {
    const element =
      typeof target === "string" ? document.getElementById(target) : target;
    if (!element) {
      throw new Error("Element not found");
    }

    const computedStyle = window.getComputedStyle(element);

    return {
      hasMaxHeight: computedStyle.maxHeight !== "none",
      hasOverflow: computedStyle.overflow !== "visible",
      hasOverflowY: computedStyle.overflowY !== "visible",
      maxHeight: computedStyle.maxHeight,
      overflow: computedStyle.overflow,
      overflowY: computedStyle.overflowY,
    };
  }
}

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = ElementCloner;
} else if (typeof window !== "undefined") {
  window.ElementCloner = ElementCloner;
}
