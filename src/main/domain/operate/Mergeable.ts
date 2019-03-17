import { Operator } from "@domain/operate/Operator";

export default interface Mergeable {
  merge(before:Mergeable):Operator;
}
