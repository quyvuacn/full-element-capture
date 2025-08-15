/**
 * Element Clone Library - A utility library for cloning HTML elements with scroll limits removed
 * @version 1.0.0
 * @author Quy Vu
 */

// Type definitions
export interface CloneOptions {
  position?: 'off-screen' | 'visible';
  styles?: Partial<CSSStyleDeclaration>;
}

export interface ClonedElementData {
  element: HTMLElement;
  remove: () => void;
  getDimensions: () => {
    width: number;
    height: number;
    offsetWidth: number;
    offsetHeight: number;
  };
}

export interface ElementDimensions {
  width: number;
  height: number;
  offsetWidth: number;
  offsetHeight: number;
}

export interface ScrollLimitInfo {
  hasMaxHeight: boolean;
  hasOverflow: boolean;
  hasOverflowY: boolean;
  maxHeight: string;
  overflow: string;
  overflowY: string;
}

export type ElementTarget = string | HTMLElement;

export class ElementCloner {
  /**
   * Check if an element has a specific CSS property set
   * @param element - The element to check
   * @param property - The CSS property to check (e.g., 'height', 'width', 'background-color')
   * @returns True if property is set, false otherwise
   */
  static checkStyleSeted(element: HTMLElement | null, property: string): boolean {
    if (!element || !property) {
      return false;
    }

    const inlineValue = element.style[property as any];
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
          const rule = rules[j] as CSSStyleRule;

          if (rule.selectorText) {
            if (element.matches(rule.selectorText)) {
              if (
                rule.style[property as any] &&
                rule.style[property as any] !== "auto" &&
                rule.style[property as any] !== ""
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
   * @param element - The element to process
   */
  static removeScrollLimits(element: HTMLElement): void {
    // Remove scroll limits from current element
    element.style.maxHeight = "unset";
    element.style.overflowY = "visible";
    element.style.overflow = "visible";

    // Recursively apply to all children
    const children = element.children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement;
      ElementCloner.removeScrollLimits(child);
    }
  }

  /**
   * Clone element and remove scroll limits
   * @param target - Element ID or HTMLElement to clone
   * @param options - Clone options
   * @returns Cloned element with scroll limits removed
   */
  static cloneElement(target: ElementTarget, options: CloneOptions = {}): HTMLElement {
    const element =
      typeof target === "string" ? document.getElementById(target) : target;
    if (!element) {
      throw new Error("Element not found");
    }

    // Clone the element
    const clonedElement = element.cloneNode(true) as HTMLElement;

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
   * @param target - Element ID or HTMLElement to clone
   * @param options - Clone options
   * @returns Object containing cloned element and cleanup function
   */
  static cloneAndAddToDOM(target: ElementTarget, options: CloneOptions = {}): ClonedElementData {
    const clonedElement = ElementCloner.cloneElement(target, {
      position: "off-screen",
      ...options,
    });

    // Add cloned element to body
    document.body.appendChild(clonedElement);

    // Return object with element and cleanup function
    return {
      element: clonedElement,
      remove: (): void => {
        if (document.body.contains(clonedElement)) {
          document.body.removeChild(clonedElement);
        }
      },
      getDimensions: (): ElementDimensions => ({
        width: clonedElement.scrollWidth,
        height: clonedElement.scrollHeight,
        offsetWidth: clonedElement.offsetWidth,
        offsetHeight: clonedElement.offsetHeight,
      }),
    };
  }

  /**
   * Get element dimensions after removing scroll limits
   * @param target - Element ID or HTMLElement
   * @returns Object with width and height
   */
  static getFullDimensions(target: ElementTarget): ElementDimensions {
    const clonedElement = ElementCloner.cloneElement(target, { position: "off-screen" });
    document.body.appendChild(clonedElement);

    const dimensions: ElementDimensions = {
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
   * @param target - Element ID or HTMLElement
   * @returns Object with scroll limit information
   */
  static checkScrollLimits(target: ElementTarget): ScrollLimitInfo {
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

export default ElementCloner; 