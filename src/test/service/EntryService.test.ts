import EntryService from "@service/EntryService";
import AcceptTokens from "@domain/accept/AcceptTokens";
import NounAcceptor from "@domain/accept/noun/NounAcceptor";
import TemporalAcceptor from "@domain/accept/noun/temporal/TemporalAcceptor";
import RelativeTemporalAcceptor from "@domain/accept/noun/temporal/RelativeTemporalAcceptor";
import YobiAcceptor from "@domain/accept/noun/temporal/YobiAcceptor";
import NumberUnitAcceptor from "@domain/accept/noun/temporal/NumberUnitAcceptor";
import KuromojiService from "@service/KuromojiService";
import EnumrateAcceptor from "@domain/accept/noun/EnumrateAcceptor";
import NumericNounAcceptor from "@domain/accept/noun/NumericNounAcceptor";
import { NumberOperator, UnitOperator } from "@domain/operate/Operator";
import { Unit } from "@domain/accept/Unit";
import EnumrateOperator from "@domain/operate/EnumrateOperator";
import FromToAcceptor from "@domain/accept/noun/FromToAcceptor";
import AmbiguousDateAcceptor from "@domain/accept/noun/AmbiguousDateAcceptor";
import ParticleAcceptor from "@domain/accept/particle/ParticleAcceptor";
import AndAcceptor from "@domain/accept/particle/AndAcceptor";
import RangeStartAcceptor from "@domain/accept/particle/RangeStartAcceptor";
import RangeEndAcceptor from "@domain/accept/particle/RangeEndAcceptor";

describe('EntryService',()=>{
  const target = new EntryService(new AcceptTokens(new NounAcceptor(new TemporalAcceptor(new RelativeTemporalAcceptor,new YobiAcceptor(),new NumberUnitAcceptor()),new EnumrateAcceptor(),new NumericNounAcceptor(),new FromToAcceptor(),new AmbiguousDateAcceptor()),new ParticleAcceptor(new AndAcceptor(),new RangeStartAcceptor(), new RangeEndAcceptor())),new KuromojiService());

  it('should be able to parse a single word',async () => {
    return target.entry('１月').then(ret=>expect(ret).toEqual({queue:{queue:[{operator:new NumberOperator(1)},{operator:new UnitOperator(Unit.MONTH)}]},errors:[]}));
  })

  it('should be able to parse a multiple word',async () => {
    return target.entry('１月,２月').then(ret=>expect(ret).toEqual({queue:{queue:[{operator:new NumberOperator(1)},{operator:new UnitOperator(Unit.MONTH)},{operator:new EnumrateOperator()},{operator:new NumberOperator(2)},{operator:new UnitOperator(Unit.MONTH)}]},errors:[]}));
  })

  it('should be able to parse a multiple number in raw',async () => {
    return target.entry('29').then(ret=>expect(ret).toEqual({queue:{queue:[{operator:new NumberOperator(29)}]},errors:[]}));
  })

});
