import Queue from "@domain/accept/Queue";
import { NumberOperator, UnitOperator } from "@domain/operate/Operator";
import { Unit } from "@domain/accept/Unit";
import EnumrateOperator from "@domain/operate/EnumrateOperator";

describe('Queue',()=>{

  it('has 1 element when first element pushed',()=>{
    const target = new Queue();
    target.push({operator:new NumberOperator(1)});
    expect(target).toEqual({queue:[{operator:new NumberOperator(1)}]});
  });

  it('should merge 2 serial numeric elements into 1 numeric element',()=>{
    const target = new Queue();
    target.push({operator:new NumberOperator(1)});
    target.push({operator:new NumberOperator(2)});
    expect(target).toEqual({queue:[{operator:new NumberOperator(12)}]});
  });

  it('should merge 4 serial numeric elements into 1 numeric element',()=>{
    const target = new Queue();
    target.push({operator:new NumberOperator(2)});
    target.push({operator:new NumberOperator(0)});
    target.push({operator:new NumberOperator(1)});
    target.push({operator:new NumberOperator(9)});
    expect(target).toEqual({queue:[{operator:new NumberOperator(2019)}]});
  });

  it('should not merge 2 non-serial numeric elements into 1 numeric element',()=>{
    const target = new Queue();
    target.push({operator:new NumberOperator(1)});
    target.push({operator:new UnitOperator(Unit.MONTH)});
    target.push({operator:new NumberOperator(2)});
    expect(target).not.toEqual({queue:[{operator:new NumberOperator(12)}]});
  });

  it('should not merge non-numeric elements into 1 numeric element',()=>{
    const target = new Queue();
    target.push({operator:new NumberOperator(1)});
    target.push({operator:new EnumrateOperator()});
    target.push({operator:new NumberOperator(2)});
    expect(target).toEqual({queue:[{operator:new NumberOperator(1)},{operator:new EnumrateOperator()},{operator:new NumberOperator(2)}]});
   });


})
