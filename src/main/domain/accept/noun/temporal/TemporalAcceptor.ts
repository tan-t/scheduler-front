import Acceptor from "@domain/accept/Acceptor";
import Token from "@domain/common/Token";
import Element from "@domain/accept/Element";
import RelativeTemporalAcceptor from "@domain/accept/noun/temporal/RelativeTemporalAcceptor";
import YobiAcceptor from "@domain/accept/noun/temporal/YobiAcceptor";
import { Unit, valOf } from "@domain/accept/Unit";
import _ from 'lodash';
import { UnitOperator } from "@domain/operate/Operator";
import NumberUnitAcceptor from "@domain/accept/noun/temporal/NumberUnitAcceptor";
import ChainOfResponsibility from "@domain/accept/ChainOfResponsibility";

export default class TemporalAcceptor implements Acceptor {
  private chain:ChainOfResponsibility;

  constructor(near:RelativeTemporalAcceptor,yobi:YobiAcceptor,num:NumberUnitAcceptor){
    this.chain = new ChainOfResponsibility().next(near).next(num).next(yobi);
  };

  accept(token:Token):Array<Element>{
    return this.chain.build()(token);
  }

  hasNext(token:Token):boolean{
    return token.pos_detail_1 !== '副詞可能';
  }

}
