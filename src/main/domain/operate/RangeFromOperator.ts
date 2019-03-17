import { Operator } from "@domain/operate/Operator";
import OperationState from "@domain/operate/OperationState";
import YearMonthDate from "@domain/operate/YearMonthDate";

export default class RangeFromOperator implements Operator {
  operate(state:OperationState):void{
    state.range.open(state.date);
    state.date = new YearMonthDate();
  }
}
