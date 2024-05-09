/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
// @ts-ignore
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  // @ts-ignore
  let nextDefineUri;

  // @ts-ignore
  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    // @ts-ignore
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            // @ts-ignore
            importScripts(uri);
            // @ts-ignore
            resolve();
          }
        })
      
      .then(() => {
        // @ts-ignore
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  // @ts-ignore
  self.define = (depsNames, factory) => {
    // @ts-ignore
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    // @ts-ignore
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    // @ts-ignore
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    // @ts-ignore
    registry[uri] = Promise.all(depsNames.map(
      // @ts-ignore
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
// @ts-ignore
define(['./workbox-fb90b81a'], (function (workbox) { 'use strict';

  // @ts-ignore
  importScripts();
  // @ts-ignore
  self.skipWaiting();
  workbox.clientsClaim();
  workbox.registerRoute("/", new workbox.NetworkFirst({
    "cacheName": "start-url",
    plugins: [{
      cacheWillUpdate: async ({
        // @ts-ignore
        response: e
      }) => e && "opaqueredirect" === e.type ? new Response(e.body, {
        status: 200,
        statusText: "OK",
        headers: e.headers
      }) : e
    }]
  }), 'GET');
  workbox.registerRoute(/.*/i, new workbox.NetworkOnly({
    "cacheName": "dev",
    plugins: []
  }), 'GET');
  // @ts-ignore
  self.__WB_DISABLE_DEV_LOGS = true;

}));
//# sourceMappingURL=sw.js.map
