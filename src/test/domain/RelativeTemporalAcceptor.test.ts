import RelativeTemporalAcceptor from '@domain/accept/noun/temporal/RelativeTemporalAcceptor';
import Token from '@domain/common/Token';

describe('NearTemporalAcceptor', () => {
  const target = new RelativeTemporalAcceptor();

  it('returns next when given １月', () => {
    expect(target.hasNext(Token.of('１月'))).toBeTruthy();
  });

  it('returns next when given 月曜日', () => {
    expect(target.hasNext(Token.of('月曜日'))).toBeTruthy();
  });

  it('can describe 今月 delta as 0', () => {
    expect(target.getDelta('今月')).toBe(0);
  });

  it('can describe 再再再再来月 delta as 5', () => {
    expect(target.getDelta('再再再再来月')).toBe(5);
  });

});
