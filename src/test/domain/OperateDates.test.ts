import OperateDates from "@domain/operate/OperateDates";
import { NumberOperator, UnitOperator } from "@domain/operate/Operator";
import { Unit } from "@domain/accept/Unit";
import moment from 'moment';
import EnumrateOperator from "@domain/operate/EnumrateOperator";
import RangeFromOperator from "@domain/operate/RangeFromOperator";

describe('OperateDates',()=>{
  const target = new OperateDates();

  it('should return 2019-01-01 given 1,month,1,date with basedate 2018-12-31',()=>{
    expect(target.operate([new NumberOperator(1),new UnitOperator(Unit.MONTH),new NumberOperator(1),new UnitOperator(Unit.DAY)],moment([2019,0,1]))).toEqual([moment([2019,0,1])]);
  });

  it('should return 2019-01-01,2019-01-05 given 1,month,1,enumrate,5 with basedate 2018-12-31',()=>{
    expect(target.operate([new NumberOperator(1),new UnitOperator(Unit.MONTH),new NumberOperator(1),new EnumrateOperator(),new NumberOperator(5)],moment([2019,0,1]))).toEqual([moment([2019,0,1]),moment([2019,0,5])]);
  });

  it('should return 2019-01-01,2019-01-02,2015-01-03 given 1,month,1,from,3 with basedate 2018-12-31',()=>{
    expect(target.operate([new NumberOperator(1),new UnitOperator(Unit.MONTH),new NumberOperator(1),new RangeFromOperator(),new NumberOperator(3)],moment([2019,0,1]))).toEqual([moment([2019,0,1]),moment([2019,0,2]),moment([2019,0,3])]);
  });

  it('should return 2019-08-01,2019-08-02,2019-08-03,2019-08-01 given 8,month,1,from,3 with basedate 2018-12-31',()=>{
    expect(target.operate([new NumberOperator(1),new UnitOperator(Unit.MONTH),new NumberOperator(1),new RangeFromOperator(),new NumberOperator(3)],moment([2019,0,1]))).toEqual([moment([2019,0,1]),moment([2019,0,2]),moment([2019,0,3])]);
  });

});
