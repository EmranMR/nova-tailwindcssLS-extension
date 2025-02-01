"use strict";
import { TailwindCSS } from "./models/TailwindCSS.ts";

let langserver: TailwindCSS | null = null;
export function activate() {
  // Do work when the extension is activated
  langserver = new TailwindCSS();
}
export function deactivate() {
  // Clean up state before the extension is deactivated
  if (langserver) {
    langserver.deactivate();
    langserver = null;
  }
}
