import YearMonthDate from "@domain/operate/YearMonthDate";
import Range from "@domain/operate/Range";
import Ranges from "@domain/operate/Ranges";

export default class OperationState {
  public date:YearMonthDate;
  public range:Range;
  public container:Ranges;
}
