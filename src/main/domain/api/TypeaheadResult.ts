import * as moment from "../../../../node_modules/moment";

moment.locale('ja');

export default class TypeaheadResult { 
    value:moment.Moment;
    label:string;

    public static from(m:moment.Moment):TypeaheadResult {
        return {value:m,label:m.format("MM/DD (ddd)")};
    }

}