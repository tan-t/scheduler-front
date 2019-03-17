import Acceptor from "@domain/accept/Acceptor";
import Element from "@domain/accept/Element";
import Token from "@domain/common/Token";
import { Yobi } from "@domain/accept/Yobi";
import YobiOperator from "@domain/operate/temporal/YobiOperator";

export default class YobiAcceptor implements Acceptor {
  private static REGEX_STR: string = '([月|火|水|木|金|土|日])';

  accept(token: Token): Array<Element> {
    const str = token.basic_form.replace(/曜[日*]/g, '');
    const visitor = new RegExp(YobiAcceptor.REGEX_STR, 'g');
    let hit: Array<string>;
    const res: Array<Element> = [];
    while (hit = visitor.exec(str), hit != null) {
      switch (hit[1]) {
        case '月':
          res.push({operator:new YobiOperator(Yobi.MON)});
          break;
        case '火':
          res.push({operator:new YobiOperator(Yobi.TUE)});
          break;
        case '水':
          res.push({operator:new YobiOperator(Yobi.WED)});
          break;
        case '木':
          res.push({operator:new YobiOperator(Yobi.THU)});
          break;
        case '金':
          res.push({operator:new YobiOperator(Yobi.FRI)});
          break;
        case '土':
          res.push({operator:new YobiOperator(Yobi.SAT)});
          break;
        case '日':
          res.push({operator:new YobiOperator(Yobi.SUN)});
          break;
        default:
          break;
      }
    }
    return res;
  }

  hasNext(token: Token): boolean {
    return true;
  }

}
