import RangeToOperator from "@domain/operate/RangeToOperator";
import AbsRegexAcceptor from "@domain/accept/AbsRegexAcceptor";

export default class RangeEndAcceptor extends AbsRegexAcceptor<RangeToOperator> {
  regex:RegExp = /^まで$/g;
  ctor = ()=>{
    return new RangeToOperator();
  }
}
