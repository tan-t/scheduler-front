import Range from "@domain/operate/Range";
import moment, { Moment, isMoment } from "moment";

export default class Ranges {
  private ranges: Array<Range> = [];

  public pushRange(range:Range) {
    this.ranges.push(range);
  }

  toDates(baseDate: Moment): Array<Moment> {
    let ret: Array<Moment> = [];
    let virtualBaseDate = moment(baseDate);
    for (let range of this.ranges) {
      if (range.startDate.year) {
        virtualBaseDate.date(1);
        virtualBaseDate.year(range.startDate.year);
      }
      // 1月15日、16日、18日、・・・って場合を想定する。
      // この場合はvirtualBaseDateの日付は1日・・・になるのか？
      // 1月15日、2日、・・・って場合は1月なのかね。
      if (range.startDate.month) {
        virtualBaseDate.date(1);
        virtualBaseDate.month(range.startDate.month - 1);
      }
      ret.push(...range.toDates(virtualBaseDate));
    }
    return ret;
  }
}
