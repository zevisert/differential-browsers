[![NPM version](http://img.shields.io/npm/v/differential-browsers.svg)](https://www.npmjs.com/package/differential-browsers)

# differential-browsers

> 💡 This library is a fork of [Polymer/tools/packages/browser-capabilities](https://github.com/Polymer/tools/tree/master/packages/browser-capabilities), but the repository has been dead for two years. The biggest offender here is Anaheim edge that is now chromium based.


A JavaScript library that detects browser capabilities from a user agent string.

The following keywords are supported. See [differential-browsers.ts](https://github.com/zevisert/differential-browsers/blob/master/src/differential-browsers.ts) for the latest browser support matrix.

| Keyword       | Description
| :----         | :----
| push          | [HTTP/2 Server Push](https://developers.google.com/web/fundamentals/performance/http2/#server-push)
| serviceworker | [Service Worker API](https://developers.google.com/web/fundamentals/getting-started/primers/service-workers)
| modules       | [JavaScript Modules](https://www.chromestatus.com/feature/5365692190687232) (including dynamic `import()` and `import.meta`)
| es2015        | [ECMAScript 2015 (aka ES6)](https://developers.google.com/web/shows/ttt/series-2/es2015)
| es2016        | ECMAScript 2016
| es2017        | ECMAScript 2017
| es2018        | ECMAScript 2018

## TODO: 

- [ ] `push` is supported for `<link rel="preload" ...>`, but `modulepreload` is not available
- [ ] `es2019` - covering: `flat` and `flatMap` `Array` methods, try .. catch` optional binding, `Object.fromEntries`, stable `Array.sort`, and more
- [ ] `es2020` - covering: optional chaining (`?.`), nullish coalescing (`??`), `export * as namespace` and `BigInt`, and more
