import Token from "@domain/common/Token";
import Element from "@domain/accept/Element";
import NounAcceptor from "@domain/accept/noun/NounAcceptor";
import ChainOfResponsibility from "@domain/accept/ChainOfResponsibility";
import Queue from "@domain/accept/Queue";
import ParticleAcceptor from "@domain/accept/particle/ParticleAcceptor";
import Result from "@domain/accept/Result";

export default class AcceptTokens {
  private chain:(token:Token)=>Array<Element>;
  constructor(noun:NounAcceptor,particle:ParticleAcceptor) {
    this.chain = new ChainOfResponsibility().next(noun).next(particle).build();
  }

  public acceptTokens(tokens:Array<Token>):Result {
    console.log(tokens);
    const queue = new Queue();
    const errors:Array<Token> = [];
    tokens.forEach(token=>{
      const elements = this.chain(token);
      elements.forEach(element => queue.push(element));
      if(elements.length == 0) {
        errors.push(token);
      }
    });
    return {queue,errors};
  }

}
