import AbsRegexAcceptor from "@domain/accept/AbsRegexAcceptor";
import EnumrateOperator from "@domain/operate/EnumrateOperator";

export default class AndAcceptor extends AbsRegexAcceptor<EnumrateOperator> {
  regex:RegExp = /^と$/g;
  ctor = ()=>{
    return new EnumrateOperator();
  }
}
