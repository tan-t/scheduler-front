import ChainOfResponsibility from "@domain/accept/ChainOfResponsibility";
import Acceptor from "@domain/accept/Acceptor";
import Element from "@domain/accept/Element";
import Token from "@domain/common/Token";
import AndAcceptor from "@domain/accept/particle/AndAcceptor";
import RangeStartAcceptor from "@domain/accept/particle/RangeStartAcceptor";
import RangeEndAcceptor from "@domain/accept/particle/RangeEndAcceptor";

export default class ParticleAcceptor implements Acceptor{
  private chain:ChainOfResponsibility;

  constructor(and:AndAcceptor,rangeStart:RangeStartAcceptor,rangeEnd:RangeEndAcceptor) {
    this.chain = new ChainOfResponsibility().next(and).next(rangeStart).next(rangeEnd);
  }

  accept(token:Token):Array<Element> {
    return this.chain.build()(token);
  }

  hasNext(token:Token):boolean{
    return token.pos !== '助詞';
  }

}
