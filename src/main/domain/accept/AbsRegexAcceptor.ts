import { Operator } from "@domain/operate/Operator";
import Acceptor from "@domain/accept/Acceptor";
import Token from "@domain/common/Token";
import Element from "@domain/accept/Element";

export default class AbsRegexAcceptor<T extends Operator> implements Acceptor {
  regex:RegExp;
  ctor:()=>T;

  accept(token:Token):Array<Element> {
    const matched = token.surface_form.match(this.regex);
    if(!matched) {
      return [];
    }
    return matched.map(m=>({operator:this.ctor()}));
  }

  hasNext(token:Token):boolean {
    return !this.regex.test(token.surface_form);
  }

}
