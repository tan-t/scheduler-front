import Element from "@domain/accept/Element";
import Mergeable from '@domain/operate/Mergeable';
import { Operator } from "@domain/operate/Operator";
import _ from 'lodash';

export default class Queue {

  private queue: Array<Element> = [];

  public push(elem:Element):void{
    if(this.queue.length < 1) {
      this.queue.push(elem);
      return;
    }
    this.queue = _.concat(_.initial(this.queue),Queue.tryMerge(_.last(this.queue),elem));
  }

  private static isMergeable(oper:Operator | Mergeable ): oper is Mergeable {
    return (<Mergeable>oper).merge !== undefined;
  }

  private static tryMerge(before:Element,after:Element):Array<Element> {
    if(typeof before.operator === typeof after.operator
      && Queue.isMergeable(before.operator)
      && Queue.isMergeable(after.operator)
    ) {
      return [{operator:(<Mergeable>after.operator).merge((<Mergeable>before.operator))}];
    }
    return [before,after];
  }

}
