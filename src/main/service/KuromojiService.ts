import Token from "@domain/common/Token";
import kuromoji, { Tokenizer, TokenizerStatic } from 'kuromoji';

export default class KuromojiService {
  private initialized: boolean = false;
  private resolvers: Array<(tokenizer: KuromojiService) => void> = [];
  public tokenize: (input: string) => Array<Token>;

  constructor() {
    kuromoji.builder({ dicPath: 'node_modules/kuromoji/dict' }).build((err, tokenizer) => {
      if (err) { throw err; }
      this.onComplete(tokenizer);
    });
  }

  onComplete(tokenizer: Tokenizer<Token>): void {
    this.initialized = true;
    this.tokenize = (input: string) => {
      return tokenizer.tokenize(input);
    }
    this.resolvers.forEach(resolve => {
      resolve(this);
    });
  }

  ensureInitialized(resolver: (tokenizer: KuromojiService) => void): void {
    if (this.initialized) {
      resolver(this);
      return;
    }
    this.resolvers.push(resolver);
  }

}
