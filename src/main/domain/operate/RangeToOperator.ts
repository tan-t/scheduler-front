import { Operator } from "@domain/operate/Operator";
import OperationState from "@domain/operate/OperationState";
import YearMonthDate from "@domain/operate/YearMonthDate";
import Range from "@domain/operate/Range";

export default class RangeToOperator implements Operator {
  operate(state:OperationState):void{
    state.range.close(state.date);
    state.container.pushRange(state.range);
    state.range = new Range();
    state.date = new YearMonthDate();
  }
}
