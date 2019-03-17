import TemporalAcceptor from "@domain/accept/noun/temporal/TemporalAcceptor";
import RelativeTemporalAcceptor from "@domain/accept/noun/temporal/RelativeTemporalAcceptor";
import YobiAcceptor from "@domain/accept/noun/temporal/YobiAcceptor";
import Token from "@domain/common/Token";
import RelativeTemporalOperator from "@domain/operate/temporal/RelativeTemporalOperator";
import { Unit } from "@domain/accept/Unit";
import YobiOperator from "@domain/operate/temporal/YobiOperator";
import { Yobi } from "@domain/accept/Yobi";
import { NumberOperator, UnitOperator } from "@domain/operate/Operator";
import NumberUnitAcceptor from "@domain/accept/noun/temporal/NumberUnitAcceptor";

describe('TemporalAcceptor',()=>{
  const target = new TemporalAcceptor(new RelativeTemporalAcceptor(), new YobiAcceptor,new NumberUnitAcceptor());

  it('returns only near temporal when 今月',()=>{
    expect(target.accept(Token.of('今月'))).toEqual([{operator:new RelativeTemporalOperator(0,Unit.MONTH)}]);
  });

  it('returns only 月曜日 when 月曜日',()=>{
    expect(target.accept(Token.of('月曜日'))).toEqual([{operator:new YobiOperator(Yobi.MON)}]);
  });

  it('returns 12 and 月 when １２月',()=>{
    expect(target.accept(Token.of('１２月'))).toEqual([{operator:new NumberOperator(12)},{operator:new UnitOperator(Unit.MONTH)}]);
  });


  it('returns 1 and 月 when １月',()=>{
    expect(target.accept(Token.of('１月'))).toEqual([{operator:new NumberOperator(1)},{operator:new UnitOperator(Unit.MONTH)}]);
  });

});
