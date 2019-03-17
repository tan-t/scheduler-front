import TemporalAcceptor from "@domain/accept/noun/temporal/TemporalAcceptor";
import ChainOfResponsibility from "@domain/accept/ChainOfResponsibility";
import Acceptor from "@domain/accept/Acceptor";
import Element from "@domain/accept/Element";
import Token from "@domain/common/Token";
import EnumrateAcceptor from "@domain/accept/noun/EnumrateAcceptor";
import NumericNounAcceptor from "@domain/accept/noun/NumericNounAcceptor";
import FromToAcceptor from "@domain/accept/noun/FromToAcceptor";
import AmbiguousDateAcceptor from "@domain/accept/noun/AmbiguousDateAcceptor";

export default class NounAcceptor implements Acceptor{
  private chain:ChainOfResponsibility;

  constructor(temporal:TemporalAcceptor,enumrate:EnumrateAcceptor,numNoun:NumericNounAcceptor,fromTo:FromToAcceptor,ambiguousDate:AmbiguousDateAcceptor) {
    this.chain = new ChainOfResponsibility().next(enumrate).next(fromTo).next(ambiguousDate).next(numNoun).next(temporal);
  }

  accept(token:Token):Array<Element> {
    return this.chain.build()(token);
  }

  hasNext(token:Token):boolean{
    return token.pos !== '名詞' && token.pos !== '記号';
  }

}
