/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

import { UAParser } from "ua-parser-js";

/**
 * A feature supported by a web browser.
 */
export type BrowserCapability =
  // ECMAScript 2015 (aka ES6).
  | "es2015"
  // ECMAScript 2016.
  | "es2016"
  // ECMAScript 2017.
  | "es2017"
  // ECMAScript 2018.
  | "es2018"
  // HTTP/2 Server Push.
  | "push"
  // Service Worker API.
  | "serviceworker"
  // JavaScript modules, including dynamic import and import.meta.
  | "modules";

export type UserAgentPredicate = (ua: InstanceType<typeof UAParser>) => boolean;

const chrome = {
  es2015: since(49),
  es2016: since(58),
  es2017: since(58),
  es2018: since(64),
  push: since(41),
  serviceworker: since(45),
  modules: since(64),
};

const browserPredicates: {
  [browser: string]: { [key in BrowserCapability]: UserAgentPredicate };
} = {
  Chrome: chrome,
  Chromium: chrome,
  "Chrome Headless": chrome,
  Opera: {
    es2015: since(36),
    es2016: since(45),
    es2017: since(45),
    es2018: since(51),
    push: since(28),
    serviceworker: since(32),
    modules: since(48),
  },
  Vivaldi: {
    es2015: since(1),
    es2016: since(1, 14),
    es2017: since(1, 14),
    es2018: since(1, 14),
    push: since(1),
    serviceworker: since(1),
    modules: since(1, 14),
  },
  // Note that Safari intends to stop changing their user agent strings
  // (https://twitter.com/rmondello/status/943545865204989953). The details of
  // this are not yet clear, since recent versions do seem to be changing (at
  // least the OS bit). Be sure to actually test real user agents rather than
  // making assumptions based on release notes.
  "Mobile Safari": {
    es2015: sinceOS(10),
    es2016: sinceOS(10, 3),
    es2017: sinceOS(10, 3),
    es2018: () => false, // No async iterator or regex lookbehind assertions
    push: sinceOS(9, 2),
    serviceworker: sinceOS(11, 3),
    modules: sinceOS(11, 3),
  },
  Safari: {
    es2015: since(10),
    es2016: since(10, 1),
    es2017: since(10, 1),
    es2018: since(12), // Caution! No regex lookbehind assertions
    // HTTP/2 on desktop Safari requires macOS 10.11 according to
    // caniuse.com.
    push: (ua) => [since(9), sinceOS(10, 11)].every((pred) => pred(ua)),
    // https://webkit.org/status/#specification-service-workers
    serviceworker: since(11, 1),
    modules: since(11, 1),
  },
  Edge: {
    // Edge versions before 15.15063 may contain a JIT bug affecting ES6
    // constructors (https://github.com/Microsoft/ChakraCore/issues/1496).
    // Since this bug was fixed after es2016 and 2017 support, all these
    // versions are the same.
    es2015: since(15, 15063),
    es2016: since(15, 15063),
    es2017: since(15, 15063),
    es2018: since(79),
    push: since(12),
    // https://developer.microsoft.com/en-us/microsoft-edge/platform/status/serviceworker/
    serviceworker: since(79),
    modules: since(79),
  },
  Firefox: {
    es2015: since(51),
    es2016: since(52),
    es2017: since(52),
    es2018: since(58), // Except RegEx additions
    // Firefox bug - https://bugzilla.mozilla.org/show_bug.cgi?id=1409570
    push: since(63),
    serviceworker: since(44),
    modules: since(67),
  },
};

/**
 * Return the set of capabilities for a user agent string.
 */
export function browserCapabilities(userAgent: string): Set<BrowserCapability> {
  const ua = new UAParser(userAgent);
  let browserName = ua.getBrowser().name || "";
  if (browserName === "Chrome" && ua.getOS().name === "iOS") {
    // Chrome on iOS is really Safari.
    browserName = "Mobile Safari";
  }

  const predicates = browserPredicates[browserName] || {};
  return new Set(
    Array.from(
      Object.keys(predicates) as BrowserCapability[]
    ).filter((capability) => predicates[capability](ua))
  );
}

/**
 * Parse a "x.y.z" version string of any length into integer parts. Returns -1
 * for a part that doesn't parse.
 */
export function parseVersion(version: string | undefined): number[] {
  if (version == null) {
    return [];
  }
  return version.split(".").map((part) => {
    const i = parseInt(part, 10);
    return Number.isNaN(i) ? -1 : i;
  });
}

/**
 * Return whether `version` is at least as high as `atLeast`.
 */
export function versionAtLeast(atLeast: number[], version: number[]): boolean {
  for (let i = 0; i < atLeast.length; i++) {
    const r = atLeast[i];
    const v = version.length > i ? version[i] : 0;
    if (v > r) {
      return true;
    }
    if (v < r) {
      return false;
    }
  }
  return true;
}

/**
 * Make a predicate that checks if the browser version is at least this high.
 */
function since(...atLeast: number[]): UserAgentPredicate {
  return (ua) => versionAtLeast(atLeast, parseVersion(ua.getBrowser().version));
}

/**
 * Make a predicate that checks if the OS version is at least this high.
 */
function sinceOS(...atLeast: number[]): UserAgentPredicate {
  return (ua) => versionAtLeast(atLeast, parseVersion(ua.getOS().version));
}
