import { Injectable, EventEmitter } from "@angular/core";
declare let numberformat;

export const THEMES = ["dark-green", "dark-blue", "light-green", "light-blue"];

@Injectable({
  providedIn: "root"
})
export class OptionsService {
  static isDark = true;
  static usaFormat = true;
  static instance: OptionsService;
  formatter: any;
  formatEmitter: EventEmitter<number> = new EventEmitter<number>();
  numFormat = "scientific";
  formatId = 0;
  timeFormatDetail = true;
  themeId = "dark-blue";
  darkSide = true;
  darkHeader = true;
  compactCardHeader = false;
  battleWinNotification = true;
  battleLostNotification = true;
  disableSmallWarpNoti = false;
  disableAllWarpNoti = false;
  disableProdStopNoti = false;
  showComponentsInfo = true;
  showDronesStatus = true;
  spaceStationNotifications = true;

  districtInfo = true;
  operativityInfo = true;
  constructor() {
    try {
      const n = 1.1;
      const separator = n.toLocaleString().substring(1, 2);
      if (separator === ",") {
        OptionsService.usaFormat = false;
      }
    } catch (ex) {}

    this.generateFormatter();
    OptionsService.instance = this;
  }
  generateFormatter() {
    this.formatId++;
    try {
      this.formatter = new numberformat.Formatter({
        format: this.numFormat,
        flavor: "short"
      });
    } catch (ex) {
      console.log("Error generate Formatter:" + ex);
    }
    this.formatEmitter.emit(1);
  }
  setHeaderTheme() {
    OptionsService.isDark = !(
      typeof this.themeId === "string" && this.themeId.includes("light")
    );
    this.darkHeader = !OptionsService.isDark && this.darkSide;
  }

  getSave(): any {
    return {
      u: OptionsService.usaFormat,
      t: this.themeId,
      d: this.darkSide,
      c: this.compactCardHeader,
      bw: this.battleWinNotification,
      bl: this.battleLostNotification,
      n: this.numFormat,
      w1: this.disableAllWarpNoti,
      w2: this.disableSmallWarpNoti,
      ps: this.disableProdStopNoti,
      ci: this.showComponentsInfo,
      ds: this.showDronesStatus,
      t1: this.districtInfo,
      t2: this.operativityInfo,
      s: this.spaceStationNotifications
    };
  }
  load(data: any) {
    if ("u" in data) OptionsService.usaFormat = data.u;
    if ("t" in data) this.themeId = data.t;
    if ("d" in data) this.darkSide = data.d;
    if ("c" in data) this.compactCardHeader = data.c;
    if ("bw" in data) this.battleWinNotification = data.bw;
    if ("bl" in data) this.battleLostNotification = data.bl;
    if ("n" in data) this.numFormat = data.n;
    if ("w1" in data) this.disableAllWarpNoti = data.w1;
    if ("w2" in data) this.disableSmallWarpNoti = data.w2;
    if ("ps" in data) this.disableProdStopNoti = data.ps;
    if ("ci" in data) this.showComponentsInfo = data.ci;
    if ("ds" in data) this.showDronesStatus = data.ds;
    if ("s" in data) this.spaceStationNotifications = data.s;

    if ("t1" in data) this.districtInfo = data.t1;
    if ("t2" in data) this.operativityInfo = data.t2;
    this.generateFormatter();
  }
}
