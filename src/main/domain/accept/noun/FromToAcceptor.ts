import Acceptor from "@domain/accept/Acceptor";
import Token from "@domain/common/Token";
import Element from "@domain/accept/Element";
import RangeFromOperator from "@domain/operate/RangeFromOperator";
import AbsRegexAcceptor from "@domain/accept/AbsRegexAcceptor";

export default class FromToAcceptor extends AbsRegexAcceptor<RangeFromOperator> {
  regex:RegExp = /[-|～|~]/g;
  ctor = ()=>{
    return new RangeFromOperator();
  }
}
