import TypeaheadResult from "@domain/api/TypeaheadResult";
import moment from 'moment';

describe('typeaheadresult',()=>{

    it('shows 04/07 (日) for input 20190407',()=>{
        expect(TypeaheadResult.from(moment('2019-04-07')).label).toBe('04/07 (日)');
    });
})