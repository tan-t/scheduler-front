import { Operator } from "@domain/operate/Operator";
import OperationState from "@domain/operate/OperationState";
import { Yobi } from "@domain/accept/Yobi";

export default class YobiOperator implements Operator {
  constructor(private yobi:Yobi){}

  operate(state:OperationState):void{
    state.range.acceptYobi(this.yobi);
  }
}
