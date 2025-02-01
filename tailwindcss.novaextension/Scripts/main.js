"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(main_exports);

// src/models/Path.ts
var Path = class {
  promise;
  constructor() {
    this.promise = this.runWhich();
  }
  async getBin() {
    return await this.promise;
  }
  /*k
   * Runs the which to find the bin
   */
  async runWhich() {
    const process = new Process("/usr/bin/env", {
      args: ["which", "tailwindcss-language-server"]
    });
    process.start();
    const stream = process.stdout;
    const reader = stream?.getReader();
    let path = "";
    if (reader != null) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        path += new TextDecoder().decode(value);
      }
    }
    return path.trim();
  }
};

// src/models/TailwindCSS.ts
var TailwindCSS = class {
  languageClient = null;
  #name = "tailwindCSS";
  constructor() {
    new Path().getBin().then((path) => {
      console.log(path);
      if (path) {
        this.start(path);
      } else {
        this.notify(
          "Install Server via npm install -g @tailwindcss/language-server, then restart"
        );
      }
    });
  }
  start(path) {
    if (this.languageClient) {
      this.languageClient.stop();
      nova.subscriptions.remove(this.languageClient);
    }
    const client = new LanguageClient(
      "TailwindCSS",
      "TailwindCSS Language Server",
      this.serverOptions(path),
      this.clientOptions()
    );
    try {
      client.start();
      nova.subscriptions.add(client);
      this.languageClient = client;
    } catch (err) {
      if (nova.inDevMode()) {
        console.error(err);
      }
    }
  }
  clientOptions() {
    return {
      debug: true,
      syntaxes: ["html", "php", "blade"]
    };
  }
  serverOptions(path) {
    return {
      path
    };
  }
  stop() {
    if (this.languageClient) {
      this.languageClient.stop();
      nova.subscriptions.remove(this.languageClient);
      this.languageClient = null;
    }
  }
  deactivate() {
    this.stop();
  }
  notify(message) {
    const request = new NotificationRequest();
    request.title = nova.localize("TailwinCSS Server");
    request.body = nova.localize(message);
    nova.notifications.add(request);
  }
};

// src/main.ts
var langserver = null;
function activate() {
  langserver = new TailwindCSS();
}
function deactivate() {
  if (langserver) {
    langserver.deactivate();
    langserver = null;
  }
}
