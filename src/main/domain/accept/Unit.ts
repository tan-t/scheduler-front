export enum Unit {
    MONTH,WEEK,YEAR,DAY
}

export const valOf:{[key:string]: Unit} = {
  '月': Unit.MONTH,
  '週': Unit.WEEK,
  '年': Unit.YEAR,
  '日': Unit.DAY
}
