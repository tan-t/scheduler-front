import AbsNumberAcceptor from "@domain/accept/noun/AbsNumberAcceptor";
import Token from "@domain/common/Token";
import { NumberOperator } from "@domain/operate/Operator";

class NumberAcceptor extends AbsNumberAcceptor {

}

describe('NumberAcceptor',()=>{
  const target  = new NumberAcceptor();

  it('returns next when the word is not numberlike',()=>{
    expect(target.hasNext(Token.of('土曜日'))).toBeTruthy();
  });

  it('returns 12 with argument １２月',()=>{
    expect(target.accept(Token.of('１２月'))). toEqual([{operator:new NumberOperator(12)}]);
  });

  it('returns empty with argument 土曜日',()=>{
    expect(target.accept(Token.of('土曜日'))). toEqual([]);
  });
})
