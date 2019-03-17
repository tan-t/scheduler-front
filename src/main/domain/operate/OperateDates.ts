import { Operator } from "@domain/operate/Operator";
import OperationState from "@domain/operate/OperationState";
import Ranges from "@domain/operate/Ranges";
import Range from "@domain/operate/Range";
import YearMonthDate from "@domain/operate/YearMonthDate";
import { Moment } from "moment";

export default class OperateDates {
  operate(operators:Array<Operator>,baseDate:Moment):Array<Moment> {
    const operation:OperationState =  {container:new Ranges(),range:new Range(),date:new YearMonthDate()};
    operators.forEach(o=>{
      o.operate(operation,baseDate);
    });
    operation.range.close(operation.date);
    operation.container.pushRange(operation.range);
    return operation.container.toDates(baseDate);
  }
}
