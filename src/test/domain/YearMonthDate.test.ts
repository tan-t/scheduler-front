import YearMonthDate from "@domain/operate/YearMonthDate";
import moment from "moment";

describe('YearMonthDate',()=>{

  it('determine exact date when passed a full year-month-date',()=>{
    const date = new YearMonthDate();
    date.acceptYear(2019);
    date.acceptMonth(1);
    date.acceptDate(1);
    expect(date.toDate(moment([2019,2,16]))).toEqual(moment([2019,0,1]));
  });

  it('assumes it as next month when passed a date-of-month of past',()=>{
    const date = new YearMonthDate();
    date.acceptYear(2019);
    date.acceptDate(15);
    expect(date.toDate((moment([2019,2,16])))).toEqual(moment([2019,3,15]));
  });

  it('assumes it as same month when passed a date-of-month of future',()=>{
    const date = new YearMonthDate();
    date.acceptYear(2019);
    date.acceptDate(15);
    expect(date.toDate((moment([2019,2,14])))).toEqual(moment([2019,2,15]));
  });

  it('assumes it as next year when passed a month of past',()=>{
    const date = new YearMonthDate();
    date.acceptMonth(2);
    date.acceptDate(15);
    expect(date.toDate(moment([2019,2,15]))).toEqual(moment([2020,1,15]));
  });

  it('assumes end date\'s date-of-month is end of the month when date is not specified',()=>{
    const date = new YearMonthDate();
    date.acceptMonth(3);
    expect(date.toDate(moment([2019,2,15]),false)).toEqual(moment([2019,2,31]));
  });

});
