import RangeFromOperator from "@domain/operate/RangeFromOperator";
import AbsRegexAcceptor from "@domain/accept/AbsRegexAcceptor";

export default class RangeStartAcceptor extends AbsRegexAcceptor<RangeFromOperator> {
  regex:RegExp = /^から$/g;
  ctor = ()=>{
    return new RangeFromOperator();
  }
}
