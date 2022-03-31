/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";

export default class ConfigHandler {
  private _contents: any;

  constructor(readonly configPath: string = "./config/config.json", readonly configRenew: number = 10) {
    this.checkAndWatch();
  }

  private checkAndWatch() {
    if (fs.existsSync(this.configPath)) {
      this.reload();
      fs.watchFile(
        this.configPath,
        { interval: this.configRenew },
        (_curr, _prev) => {
          console.log("Config file modified. Reloading...");
          this.reload();
        }
      );
    } else {
      throw new Error(`Configuration file '${this.configPath}' not exists`);
    }
  }

  private reload() {
    this._contents = JSON.parse(fs.readFileSync(this.configPath, "utf-8"));
  }

  get contents(){
    return this._contents;
  }

}
