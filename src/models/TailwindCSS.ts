import { Path } from "./Path.ts";
export class TailwindCSS {
  languageClient: LanguageClient | null = null;
  readonly #name = "tailwindCSS";

  constructor() {
    new Path().getBin().then((path) => {
      console.log(path);
      if (path) {
        this.start(path);
      } else {
        this.notify(
          "Install Server via npm install -g @tailwindcss/language-server, then restart",
        );
      }
    });
  }

  start(path: string) {
    if (this.languageClient) {
      this.languageClient.stop();
      nova.subscriptions.remove(this.languageClient);
    }
    // Create the client
    const client = new LanguageClient(
      "TailwindCSS",
      "TailwindCSS Language Server",
      this.serverOptions(path),
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
      debug: true,
      syntaxes: ["html", "php", "blade"],
    };
  }

  private serverOptions(path: string) {
    return {
      path: path,
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
