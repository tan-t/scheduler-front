import OperateDates from "@domain/operate/OperateDates";
import { Moment } from "moment";
import Element from "@domain/accept/Element";

export default class OutputService {
  constructor(private opeartion:OperateDates){};

  public output(elements:Array<Element>,baseDate:Moment):Array<Moment> {
    return this.opeartion.operate(elements.map(e=>e.operator),baseDate);
  }

}
