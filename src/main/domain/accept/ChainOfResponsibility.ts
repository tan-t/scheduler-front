import Element from "@domain/accept/Element";
import Acceptor from "@domain/accept/Acceptor";
import Token from "@domain/common/Token";

export default class ChainOfResponsibility {
  private responsibilities:Array<Acceptor> = [];

  public next(responsibility:Acceptor):ChainOfResponsibility {
    this.responsibilities.push(responsibility);
    return this;
  }

  public build():(token:Token)=>Array<Element> {
    return (token:Token) => {
      const ret:Array<Element> = [];
      for(let responsibility of this.responsibilities) {
        ret.push(...responsibility.accept(token));
        if(!responsibility.hasNext(token)){
          return ret;
        }
      }
      return ret;
    };
  }

}
