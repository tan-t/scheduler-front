import Token from "@domain/common/Token";
import Element from '@domain/accept/Element';

export default interface Acceptor {
  accept(token:Token):Array<Element>;
  hasNext(token:Token):boolean;
}
