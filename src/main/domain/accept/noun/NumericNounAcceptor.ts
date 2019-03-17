import AbsNumberAcceptor from "@domain/accept/noun/AbsNumberAcceptor";
import Token from "@domain/common/Token";
import Element from "@domain/accept/Element";

export default class NumericNounAcceptor extends AbsNumberAcceptor {

  accept(token:Token):Array<Element> {
    // 数詞でなければ対応しない。
    if(this.hasNext(token)) {
      return [];
    }
    return super.accept(token);
  }

  hasNext(token:Token):boolean {
    return token.pos_detail_1 !== '数';
  }

}
