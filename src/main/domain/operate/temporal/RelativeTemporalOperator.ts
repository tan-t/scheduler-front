import { Unit } from "@domain/accept/Unit";
import { Operator } from "@domain/operate/Operator";
import OperationState from "@domain/operate/OperationState";
import { Moment } from "moment";

export default class RelativeTemporalOperator implements Operator {
  constructor(private delta: number, private unit: Unit) {

  }

  operate(state:OperationState,baseDate:Moment) {
    state.date.acceptMonth(baseDate.month() + 1 + this.delta);
  }
}
