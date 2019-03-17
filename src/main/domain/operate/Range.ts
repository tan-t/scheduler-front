import YearMonthDate from "@domain/operate/YearMonthDate";
import moment,{ Moment } from "moment";

export default class Range {

  private filters: Array<(date: Moment) => boolean> = [];
  startDate: YearMonthDate;
  endDate: YearMonthDate;

  acceptYobi(yobi: number): void {
    this.acceptFilter((date: Moment) => {
      return date.day() == yobi;
    });
  }

  acceptFilter(filter: (date: Moment) => boolean): void {
    this.filters.push(filter);
  }

  open(startDate: YearMonthDate): void {
    this.startDate = startDate;
  }

  close(d: YearMonthDate) {
    if (!this.startDate) {
      this.startDate = YearMonthDate.clone(d);
    }
    this.endDate = YearMonthDate.clone(d);
    console.log(this);
  }

  filter(date: Moment): boolean {
    return this.filters.length == 0  || this.filters.some(f => f(date));
  }

  toDates(baseDate: Moment) {
    let ret = [];
    let date = this.startDate.toDate(baseDate,true);
    let limit = this.endDate.toDate(baseDate,false);
    while (date <= limit) {
      if (this.filter(date)) {
        ret.push(date);
      }
      date = moment([date.year(), date.month(), date.date() + 1]);
    }
    return ret;
  }

}
