import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge classnames together
 *
 * @param {ClassValue[]} inputs - The classnames to merge
 * @returns {string} - The merged classnames
 */
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

/**
 * Convert RGB to HEX
 *
 * @param {number} r - The red value
 * @param {number} g - The green value
 * @param {number} b - The blue value
 * @returns {string} - The HEX color code
 */
export const RGBToHex = (r: number, g: number, b: number): string => {
  const componentToHex = (c: number): string => {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  const redHex: string = componentToHex(r);
  const greenHex: string = componentToHex(g);
  const blueHex: string = componentToHex(b);

  return "#" + redHex + greenHex + blueHex;
};

/**
 * Convert HEX to RGB
 *
 * @param {string} hex - The HEX color code
 * @returns {number[]} - The RGB values
 * @throws {Error} - Throws an error if the HEX color code is invalid
 */
export function hslToHex(hsl: string): string {
  // Remove "hsla(" and ")" from the HSL string
  let hslValues = hsl.replace("hsla(", "").replace(")", "");

  // Split the HSL string into an array of H, S, and L values
  const [h, s, l] = hslValues.split(" ").map((value) => {
    if (value.endsWith("%")) {
      // Remove the "%" sign and parse as a float
      return parseFloat(value.slice(0, -1));
    } else {
      // Parse as an integer
      return parseInt(value);
    }
  });

  // Function to convert HSL to RGB
  function hslToRgb(h: number, s: number, l: number): string {
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number): number => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    // Convert RGB values to integers
    const rInt = Math.round(r * 255);
    const gInt = Math.round(g * 255);
    const bInt = Math.round(b * 255);

    // Convert RGB values to a hex color code
    const rgbToHex = (value: number): string => {
      const hex = value.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${rgbToHex(rInt)}${rgbToHex(gInt)}${rgbToHex(bInt)}`;
  }

  // Call the hslToRgb function and return the hex color code
  return hslToRgb(h, s, l);
}

export const hexToRGB = (hex: string, alpha?: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } else {
    return `rgb(${r}, ${g}, ${b})`;
  }
};

/**
 * Check if values are considered empty
 *
 * @param {string | number | boolean | undefined | null | Array | Object} args - The values to check
 * @return {boolean} - Returns true if the values are empty
 */
export const isEmpty = (...args: any[]): boolean => {
  return args.every((value) => {
    if (typeof value === "string") return value.trim().length === 0;
    if (value instanceof Array) return value.length === 0;
    if (value instanceof Object) return Object.keys(value).length === 0;
    return value === undefined || value === null;
  });
};

/**
 * Check if values is considered not empty
 *
 * @param {string | number | boolean | undefined | null | Array | Object} args - The values to check
 * @return {boolean} - Returns true if the values are not empty
 */
export const isNotEmpty = (...args: any[]): boolean => {
  return !isEmpty(...args);
};

/**
 * Check if value is a number
 *
 * @param {any} value - The value to check
 * @return {boolean} - Returns true if the value is a number
 */
export const isNumber = (value: any): boolean => {
  return !isNaN(value);
};

/**
 * Do something n times
 *
 * @param {number} time - The times to loop
 * @param {Function} callback - The callback function
 */
export const times = (n: number, callback: Function, delay: number = 0) => {
  for (let i = 0; i < n; i++) {
    setTimeout(() => {
      callback();
    }, i * delay);
  }
};

/**
 * Wait for a specified amount of time to complete before continuing to process
 *
 * @param {number} ms - The time to wait in milliseconds
 */
export const wait = async (ms: number = 1000, callback?: Function) => {
  await new Promise((resolve) => setTimeout(resolve, ms));
  if (callback) return callback();
};

/**
 * Concatenate values together joined by spaces or any
 *
 * @param {string} join - The string to join the values together
 * @param {(string | number | boolean | undefined | null)[]} args - The values to concatenate
 */
export const concatenate = (
  join: string = " ",
  ...args: (string | number | boolean | undefined | null)[]
): string => {
  return args.filter((arg) => isNotEmpty(arg)).join(join);
};

/**
 * Check if value is in an array
 *
 * @param {any} value - The value to check
 * @param {any[]} array - The array to check against
 * @return {boolean} - Returns true if the value is in the array
 */
export const isIn = (value: any, array: any[]): boolean => {
  return array.includes(value);
};

/**
 * Check if value is not in an array
 *
 * @param {any} value - The value to check
 * @param {any[]} array - The array to check against
 * @return {boolean} - Returns true if the value is not in the array
 */
export const isNotIn = (value: any, array: any[]): boolean => {
  return !isIn(value, array);
};

/**
 * Repeat action upon error up to n times
 *
 * @param {number} n - The times to loop
 * @param {Function} callback - The callback function
 */
export const repeatOnError = async (n: number, callback: Function) => {
  let error = null;
  for (let i = 0; i < n; i++) {
    try {
      await callback();
      error = null;
      break;
    } catch (e) {
      error = e;
    }
  }

  if (error) {
    throw error;
  }
};

/**
 * Perform action after delay. If another action is performed before the
 * previous action is completed, the previous action will be cancelled.
 *
 * @param {Function} callback - The callback function
 * @param {number} delay - The delay in milliseconds
 */
export const debounce = (callback: Function, delay: number = 1000) => {
  // Declare a variable called 'timer' to store the timer ID
  let timer: NodeJS.Timeout;

  // Return an anonymous function that takes in any number of arguments
  return function (...args: any[]) {
    // Clear the previous timer to prevent the execution of 'callback'
    clearTimeout(timer);

    // Set a new timer that will execute 'callback' after the specified delay
    timer = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

/**
 * returnDoIf
 */
export const doIfReturn = (condition: boolean, callback: Function) => {
  if (condition) {
    return callback();
  } else {
    return undefined;
  }
};

/**
 * Returns null if the value of the specified keys is empty
 * else if the value of the specified keys is not empty, return the item
 *
 * @param {T} item - The object to check
 * @param {keyof T} keys - The keys to check
 */
export const nullifyInvalidObject = <T extends unknown>(
  item: T,
  keys: (keyof T)[],
): T | null => {
  const invalidKeys = keys.filter((key) => isEmpty(item[key]));
  if (invalidKeys.length === 0) {
    return item;
  }
  return null;
};

/**
 * Returns a reduced array of objects that does not contain
 * the specified keys if the value of the key is empty
 *
 * @param {T[]} items - The array of objects to reduce
 * @param {keyof T} keys - The keys to check
 *
 * @returns {T[]} - The reduced array of objects
 */
export const reduceInvalidObjects = <T extends unknown>(
  items: T[],
  keys: (keyof T)[],
): T[] => {
  return items.reduce((acc, item) => {
    const invalidKeys = keys.filter((key) => isEmpty(item[key]));
    if (invalidKeys.length === 0) {
      acc.push(item);
    }
    return acc;
  }, [] as T[]);
};

/**
 * Replace the name of keys of an object and return the objects of new type
 * with keys replaced by the specified transform object
 */
export const reduceTransformObjects = <T extends Record<string, unknown>, U>(
  items: T[],
  transform: { [key in keyof Partial<T>]: U },
) => {
  return items.map((item) => {
    const newItem: T = {} as any;
    (Object.keys(item) as (keyof T)[]).forEach((key) => {
      const newKey = transform[key] ?? (key as keyof T);
      newItem[newKey as keyof T] = item[key];
    });
    return newItem;
  }) as any[];
};

/**
 * Clamps a value between a minimum and maximum range.
 * @param value The value to be clamped.
 * @param min The minimum value of the range.
 * @param max The maximum value of the range.
 * @returns The clamped value.
 */
export const minMax = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Generates a random number between the specified minimum and maximum values.
 *
 * @param min - The minimum value of the range (inclusive).
 * @param max - The maximum value of the range (inclusive).
 * @returns A random number between the minimum and maximum values.
 */
const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

/**
 * Generate random points from the specified number of points
 *
 * @param {number}  points - Number of points to generate
 * @param {number}  min - The minimum value of the points
 * @param {number}  max - The maximum value of the points
 * @returns {Point[]} - The generated random points
 */
export const randomPoints = (
  points: number,
  min: number = 0,
  max: number = 100,
) => {
  return Array.from({ length: points }).map((_) => ({
    x: Math.floor(Math.random() * (max - min + 1) + min),
    y: Math.floor(Math.random() * (max - min + 1) + min),
  }));
};

/**
 * Generates a random value from the specified list
 *
 * @param {T[]} list - The list of values
 * @returns {T} - The random value
 */
export const randomFromList = <T extends unknown>(list: T[]): T => {
  return list[Math.floor(Math.random() * list.length)];
};

/**
 * Generates a random value from the specified object
 *
 * @param {T} object - The object of values
 * @returns {T[keyof T]} - The random value
 */
export const randomFromObject = <T extends Record<string, unknown>>(
  object: T,
): T[keyof T] => {
  const keys = Object.keys(object);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return object[randomKey as keyof T];
};

/**
 * Generates a random value from the specified range
 *
 * @param {number} min - The minimum value of the range
 * @param {number} max - The maximum value of the range
 * @returns {number} - The random value
 */
export const randomFromRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

/**
 * Generates a random value from the specified matrix
 *
 * @param {T[][]} matrix - The matrix of values
 * @returns {T} - The random value
 */
export const randomFromMatrix = <T extends unknown>(matrix: T[][]): T => {
  const randomRow = matrix[Math.floor(Math.random() * matrix.length)];
  return randomRow[Math.floor(Math.random() * randomRow.length)];
};

/**
 * Generates a random value from the specified set
 *
 * @param {Set<T>} set - The set of values
 * @returns {T} - The random value
 */
export const randomFromSet = <T extends unknown>(set: Set<T>): T => {
  const randomIndex = Math.floor(Math.random() * set.size);
  return Array.from(set)[randomIndex];
};

/**
 * Generates a random value from the specified map
 *
 * @param {Map<K, V>} map - The map of values
 * @returns {V} - The random value
 */
export const randomFromMap = <K, V>(map: Map<K, V>): V => {
  const randomIndex = Math.floor(Math.random() * map.size);
  return Array.from(map.values())[randomIndex];
};

/**
 * Generates a random value from the specified tuple
 *
 * @param {T[]} tuple - The tuple of values
 * @returns {T} - The random value
 */
export const randomFromTuple = <T extends unknown>(tuple: [T, ...T[]]): T => {
  return tuple[Math.floor(Math.random() * tuple.length)];
};

/**
 * Returns the first not empty value from the specified values
 *
 * @param args - The values to check
 * @returns The first not empty value
 */
export const firstNotEmptyFromValues = <T extends unknown>(
  ...args: T[]
): T | undefined => {
  return args.find((value) => isNotEmpty(value));
};

/**
 * Returns a fallback value if the specified value is empty
 *
 * @param value - The value to check
 * @param fallback - The fallback value
 * @returns The value or the fallback value
 */
export const fallbackValueIfEmpty = <
  T extends unknown,
  U extends unknown = undefined,
>(
  value: T,
  fallback: U,
): T | U => {
  return isNotEmpty(value) ? value : fallback;
};

/**
 * Returns a fallback value if the specified value is not empty
 *
 * @param value - The value to check
 * @param fallback - The fallback value
 * @returns The value or the fallback value
 */
export const fallbackValueIfNotEmpty = <
  T extends unknown,
  U extends unknown = undefined,
>(
  value: T,
  fallback: U,
): T | U => {
  return isNotEmpty(value) ? fallback : value;
};
