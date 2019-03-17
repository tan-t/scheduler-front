import AmbiguousDateOperator from "@domain/operate/AmbiguousDateOperator";
import AbsRegexAcceptor from "@domain/accept/AbsRegexAcceptor";

export default class AmbiguousDateAcceptor extends AbsRegexAcceptor<AmbiguousDateOperator> {
  regex:RegExp = /[\/|.|／|．]/g;
  ctor:()=>AmbiguousDateOperator = () => {
    return new AmbiguousDateOperator();
  };
}
