import * as moment from "../../../../node_modules/moment";


export default class TypeaheadResult { 
    value:moment.Moment;
    label:string;

    public static from(m:moment.Moment):TypeaheadResult {
        moment.locale('ja');
        return {value:m,label:m.toLocaleString()};
    }

}