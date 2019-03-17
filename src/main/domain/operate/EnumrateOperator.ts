import { Operator } from "@domain/operate/Operator";
import OperationState from "@domain/operate/OperationState";
import Range from "@domain/operate/Range";
import YearMonthDate from "@domain/operate/YearMonthDate";

export default class EnumrateOperator implements Operator {
  operate(state:OperationState):void{
    state.range.close(state.date);
    state.container.pushRange(state.range);
    state.range = new Range();
    state.date = new YearMonthDate();
  }
}
