import Token from '@domain/common/Token';
import { Unit, valOf } from '@domain/accept/Unit';
import Element from '@domain/accept/Element';
import RelativeTemporalOperator from "@domain/operate/temporal/RelativeTemporalOperator";
import Acceptor from '@domain/accept/Acceptor';
import _ from 'lodash';

export default class RelativeTemporalAcceptor implements Acceptor {
  public accept(token: Token): Array<Element> {
    const str = token.basic_form;
    const delta = this.getDelta(str);
    if (delta < 0) {
      return [];
    }
    const unit = this.popUnit(str);
    return [{ operator: new RelativeTemporalOperator(delta, valOf[unit]) }];
  }

  private popUnit(str:string):string{
    return _.last(str);
  }

  public hasNext(token:Token):boolean{
    const str = token.basic_form;
    return this.getDelta(str) < 0 || valOf[this.popUnit(str)] === undefined;
  }

  public getDelta(str: string) {
    if (/今/g.test(str)) {
      return 0;
    }
    if (/来/g.test(str)) {
      const sasaraiProcessed = str.replace(/々/g, '再');
      const matchedSa = sasaraiProcessed.match(/再/g);
      if (!matchedSa) {
        return 1;
      }
      return matchedSa.length + 1;
    }

    return -1;
  }
}
