import moment, { Moment } from 'moment';

export default class YearMonthDate {
  year:number;
  month:number;
  date:number = 0;

  working:number;

  static clone(origin:YearMonthDate):YearMonthDate{
    let ret = new YearMonthDate();
    ret.year = origin.year;
    ret.month = origin.month;
    ret.working = origin.working;
    ret.date = origin.date;
    return ret;
  }

  acceptNumber(num:number) {
    this.working = num;
  }

  acceptAmbiguousThing(num:number, baseDate:Moment) {
    // 精一杯頑張る。
    if (num > 1900) {
      this.acceptYear(num);
      return;
    }
    if (num < 13 && !this.month) {
      this.acceptMonth(num); // たぶん。。。自信ない。
    }
    this.acceptDate(num);
  }

  acceptYear(year:number) {
    this.year = year;
  }

  acceptMonth(month:number) {
    this.month = month;
  }

  toDate(baseDate:Moment, start?:boolean):Moment {
    if(!this.month || !this.year || this.working > 0) {
      this.assumeFromBaseDate(baseDate,start);
    }
    return moment([this.year,this.month-1,this.date]);
  }

  acceptDate(date:number) {
    this.date = date;
  }

  assumeFromBaseDate(baseDate:Moment, start?:boolean) {
    // この時点でworkingがあれば確実に日付なので、日付にしておく。
    if (this.working > 0) {
      this.acceptDate(this.working);
    }
    if (!this.month) {
      this.month = this.assumeMonth(baseDate);
    }
    if (!this.year) {
      this.year = this.assumeYear(baseDate);
    }

    if(start === undefined) {
      return;
    }

    this.date = this.assumeDateInRange(baseDate,start);
  }

  assumeDateInRange(baseDate:Moment, start:boolean):number {
    if(this.date) {
      return this.date;
    }

    const baseMonth = baseDate.month() + 1;
    if (start) {
      return baseMonth < this.month ? 1 : baseDate.date() + 1;
    }
    const endDate = moment([this.year, this.month -1 , 1]).daysInMonth();
    return endDate;
  }

  assumeYear(baseDate:Moment) {
    const baseMonth = baseDate.month() + 1;
    const baseYear = baseDate.year();
    // 今2018年12月15日で、予定が「1月15日」っていうインプットだった場合、十中八九2019年だよね。
    return baseMonth <= this.month ? baseYear : baseYear + 1;
  }

  assumeMonth(baseDate:Moment) {
    let baseMonth = baseDate.month() + 1;
    let baseDay = baseDate.date();
    // 今1月15日で、予定が「2日」っていうインプットだった場合、十中八九2月2日だよね。
    // でも、dateが0だったら今月・・・むつかしい。
    if (!this.date) {
      return baseMonth;
    }
    return baseDay <= this.date ? baseMonth : baseMonth + 1;
  }

  /**
   * 現在の数値を返して、0に戻す
   */
  exchangeWorking():number{
    const working = this.working;
    this.working = 0;
    return working;
  }

}
