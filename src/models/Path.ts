export class Path {
  promise: Promise<string>;

  constructor() {
    this.promise = this.runWhich();
  }

  async getBin() {
    return await this.promise;
  }

  /*k
   * Runs the which to find the bin
   */
  async runWhich(): Promise<string> {
    const process = new Process("/usr/bin/env", {
      args: ["which", "tailwindcss-language-server"],
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
}
