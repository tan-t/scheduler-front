import OperationState from "@domain/operate/OperationState";
import { Unit } from "@domain/accept/Unit";
import Mergeable from "@domain/operate/Mergeable";
import { Moment } from "moment";

export interface Operator {
    operate(state:OperationState,baseDate:Moment):void;
}

export class UnitOperator implements Operator {
    constructor(public unit:Unit){}

    operate(state:OperationState,baseDate:Moment):void{
      switch(this.unit) {
        case Unit.DAY:
          state.date.acceptDate(state.date.exchangeWorking());
          break;
        case Unit.MONTH:
          state.date.acceptMonth(state.date.exchangeWorking());
          break;
        case Unit.YEAR:
          state.date.acceptYear(state.date.exchangeWorking());
          break;
      }
    }
}

export class NumberOperator implements Operator,Mergeable {

  constructor(private num:number){};

  merge(before:NumberOperator):NumberOperator{
    return new NumberOperator(parseInt(String(before.num) + String(this.num)));
  }

  operate(state:OperationState):void{
    state.date.acceptNumber(this.num);
  }


}
