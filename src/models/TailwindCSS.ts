import { CacheClean } from "../Commands/CleanCache.ts";
import { Path } from "./Path.ts";
export class TailwindCSS {
  languageClient: LanguageClient | null = null;
  #path?: string;
  readonly #name = "tailwindCSS";

  constructor() {
    new Path().getBin().then((path) => {
      this.#path = path;
      if (path) {
        this.start();
      } else {
        this.notify(
          "Install Server via npm install -g @tailwindcss/language-server, then restart",
        );
      }
    });

    this.registerCommands();
  }

  private registerCommands() {
    new CacheClean(this);
  }

  start() {
    if (this.languageClient) {
      this.languageClient.stop();
      nova.subscriptions.remove(this.languageClient);
    }
    // Create the client
    const client = new LanguageClient(
      "TailwindCSS",
      "TailwindCSS Language Server",
      this.serverOptions(),
      this.clientOptions(),
    );
    try {
      // Start the client
      client.start();
      // Add the client to the subscriptions to be cleaned up
      nova.subscriptions.add(client);
      this.languageClient = client;
    } catch (err) {
      // If the .start() method throws, it's likely because the path to the language server is invalid
      if (nova.inDevMode()) {
        console.error(err);
      }
    }
  }

  private clientOptions() {
    return {
      syntaxes: [
        "php",
        "php_only",
        "blade",
        "html",
        "javascript",
        "typescript",
      ],
    };
  }

  private serverOptions() {
    return {
      path:
        "/Users/Emran/.nvm/versions/node/v20.11.1/bin/tailwindcss-language-server",
      // path: this.#path,
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

  public notify(message: string) {
    const request = new NotificationRequest();

    request.title = nova.localize("TailwinCSS Server");
    request.body = nova.localize(message);
    nova.notifications.add(request);
  }
}
