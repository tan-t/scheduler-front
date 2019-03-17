import YobiAcceptor from "@domain/accept/noun/temporal/YobiAcceptor";
import Token from "@domain/common/Token";

describe('YobiAcceptor',()=>{
  const target = new YobiAcceptor();

  it('returns next when １月',()=>{
    expect(target.hasNext(Token.of('１月'))).toBeTruthy();
  });

  it('returns next when 今月',()=>{
    expect(target.hasNext(Token.of('今月'))).toBeTruthy();
  });
})
