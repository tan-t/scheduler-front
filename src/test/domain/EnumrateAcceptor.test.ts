import Token from "@domain/common/Token";
import EnumrateAcceptor from "@domain/accept/noun/EnumrateAcceptor";
import EnumrateOperator from "@domain/operate/EnumrateOperator";

describe('EnumrateAcceptor',()=>{
  const target  = new EnumrateAcceptor();

  it('returns next when the word is not enumratelike',()=>{
    expect(target.hasNext(Token.of('土曜日'))).toBeTruthy();
  });

  it('returns a one with argument ,',()=>{
    expect(target.accept(Token.of(','))). toEqual([{operator:new EnumrateOperator()}]);
  });

});
