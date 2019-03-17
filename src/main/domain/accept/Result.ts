import Queue from "@domain/accept/Queue";
import Token from "@domain/common/Token";

export default class Result {
  queue:Queue;
  errors:Array<Token>;
}
