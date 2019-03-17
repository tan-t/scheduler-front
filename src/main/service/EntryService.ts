import KuromojiService from "@service/KuromojiService";
import NounAcceptor from "@domain/accept/noun/NounAcceptor";
import AcceptTokens from "@domain/accept/AcceptTokens";
import Queue from "@domain/accept/Queue";
import Result from "@domain/accept/Result";

export default class EntryService {
  constructor(private acceptance:AcceptTokens,private kuromoji:KuromojiService){
  };

  async entry(input:string):Promise<Result> {
    return new Promise<Result>((resolve,reject)=>{
      this.kuromoji.ensureInitialized((tokenizer)=>{
        const result = this.acceptance.acceptTokens(tokenizer.tokenize(input));
        resolve(result);
      });
    });
  }

}
