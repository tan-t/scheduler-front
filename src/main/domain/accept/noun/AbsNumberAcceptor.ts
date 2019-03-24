import Acceptor from "@domain/accept/Acceptor";
import Token from "@domain/common/Token";
import Element from "@domain/accept/Element";
import { NumberOperator } from "@domain/operate/Operator";

export  default abstract class AbsNumberAcceptor implements Acceptor {

  accept(token:Token):Array<Element>{
    const numbers = AbsNumberAcceptor.toHankaku(token.surface_form).match(/(\d+)/g);
    if(!numbers) {
      return [];
    }
    return numbers.map(n=>({operator:new NumberOperator(parseInt(n))}));
  };

  hasNext(token:Token):boolean{
    return !AbsNumberAcceptor.containsNumber(token.surface_form);
  };

  public static containsNumber(str:string):boolean{
    return /\d+/.test(AbsNumberAcceptor.toHankaku(str));
  };

  public static isNumber(str:string):boolean{
    return /^\d+$/.test(AbsNumberAcceptor.toHankaku(str));
  };

  private static toHankaku(str:string):string{
    return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => {
      return String.fromCharCode(s.charCodeAt(0) - 65248);
    });
  };

}
