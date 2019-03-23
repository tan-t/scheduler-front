import OperateDates from "@domain/operate/OperateDates";
import { Moment } from "moment";
import Element from "@domain/accept/Element";
import TypeaheadResult from "@domain/api/TypeaheadResult";

export default class OutputService {
  constructor(private opeartion:OperateDates){};

  public output(elements:Array<Element>,baseDate:Moment):Array<TypeaheadResult> {
    return this.opeartion.operate(elements.map(e=>e.operator),baseDate).map(m=>TypeaheadResult.from(m));
  }

}
