import { IpadicFeatures } from "kuromoji";

export default class Token implements IpadicFeatures {
  word_id: number;
  word_type: string;
  word_position: number;
  surface_form: string;
  pos: string;
  pos_detail_1: string;
  pos_detail_2: string;
  pos_detail_3: string;
  conjugated_type: string;
  conjugated_form: string;
  basic_form: string;
  reading?: string;
  pronunciation?: string;

  public static of(str: string): Token {
    const ret = new Token();
    ret.basic_form = str;
    ret.surface_form = str;
    return ret;
  }
};
