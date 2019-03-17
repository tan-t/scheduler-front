import Acceptor from "@domain/accept/Acceptor";
import Token from "@domain/common/Token";
import Element from "@domain/accept/Element";
import EnumrateOperator from "@domain/operate/EnumrateOperator";
import AbsRegexAcceptor from "@domain/accept/AbsRegexAcceptor";

export default class EnumrateAcceptor extends AbsRegexAcceptor<EnumrateOperator> {
  regex:RegExp = /([,|、|，])/g;
  ctor:()=>EnumrateOperator = () => {
    return new EnumrateOperator();
  };
}
