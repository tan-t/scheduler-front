import Acceptor from "@domain/accept/Acceptor";
import Element from "@domain/accept/Element";
import Token from "@domain/common/Token";
import { Yobi } from "@domain/accept/Yobi";
import YobiOperator from "@domain/operate/temporal/YobiOperator";
import AbsNumberAcceptor from "@domain/accept/noun/AbsNumberAcceptor";
import { Unit, valOf } from "@domain/accept/Unit";
import { UnitOperator } from "@domain/operate/Operator";
import _ from 'lodash';

export default class NumberUnitAcceptor extends AbsNumberAcceptor {

  accept(token: Token): Array<Element> {
    const ret:Array<Element> = [];
    const units = this.acceptUnit(token);
    if(units.length === 0){
      return [];
    }
    ret.push(...super.accept(token));
    ret.push(...units);
    return ret;
  }

  hasNext(token: Token): boolean {
    return super.hasNext(token);
  }

  acceptUnit(token:Token):Array<Element>{
    const unit:Unit = valOf[_.last(token.basic_form)];
    if(unit == undefined){
      return [];
    }
    return [{operator:new UnitOperator(unit)}];
  }

}
