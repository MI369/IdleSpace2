import { ZERO } from "../CONSTANTS";

export abstract class Job {
  progress = ZERO;
  total: Decimal;
  max: number;
  level = 0;
  initialPrice: Decimal;
  growRate = 1.1;
  description = "";
  name = "";
  progressPercent = 0;
  timeToEnd?: number;

  /**
   * Adds progress
   * @param progress to add
   * @returns rest
   */
  addProgress(pro: DecimalSource): Decimal {
    this.progress = this.progress.plus(pro);
    let ret: Decimal;
    if (this.progress.gte(this.total)) {
      // Completed !
      ret = this.progress.minus(this.total);
      this.progress = ZERO;
      this.onCompleted();
      this.level++;
      this.level = Math.min(this.level, this.max);
      this.reload();
    } else {
      ret = ZERO;
    }
    return ret;
  }

  onCompleted() {}

  reload() {
    this.total = this.initialPrice.times(
      Decimal.pow(this.growRate, this.level)
    );
  }

  reloadUi() {
    this.progressPercent = Math.floor(
      this.progress.div(this.total).toNumber() * 100
    );
  }
}