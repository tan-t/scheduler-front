const kuromoji = require('kuromoji');
const NearTemporalService = require('./NearTemporalAcceptService.js');

const regex = '(.+?)( |$)';
const getDateString = (d) => {
    return `${d.getFullYear()}-${("0" + String(d.getMonth() + 1)).slice(-2)}-${("0" + String(d.getDate())).slice(-2)}(${JapaneseYoubi[d.getDay()]})`;
};
JapaneseYoubi = {
    0: '日',
    1: '月',
    2: '火',
    3: '水',
    4: '木',
    5: '金',
    6: '土'
};

class Tokenizer {
    constructor() {
        this.initialized = false;
        this.resolvers = [];
        this.tokenize = null;
    }
    completeInit(tokenizer) {
        this.tokenize = tokenizer.tokenize.bind(tokenizer);
        this.initialized = true;
        this.resolvers.forEach(resolver=>{
            resolver(this);
        });
    }
    ensureInitialized(resolver) {
        if(this.initialized){
            return resolver(this);
        }
        this.resolvers.push(resolver);
        return;
    }
}

const tokenizer_ = new Tokenizer();
kuromoji.builder({dicPath:'node_modules/kuromoji/dict'}).build((err,tokenizer)=>{
    if(err) {throw err;}
    tokenizer_.completeInit(tokenizer);
});

module.exports = {
    tokenizer(){
        return tokenizer_;
    },

    typeahead(typed,baseDate) {
        return new Promise((resolve,reject)=>{
            tokenizer_.ensureInitialized((tokenizer)=>{
                let visitor = new RegExp(regex, 'g');
                let hit;
                let ret = { candidates: [], errors: [] };
                while (hit = visitor.exec(typed), hit != null) {
                    let arg = hit[1];
                    let result = this.assume(arg, baseDate, tokenizer);
                    ret.candidates.push(...result.output);
                    ret.errors.push(...result.errors);
                }
                console.log(JSON.stringify(ret));
                resolve(ret);
            });
        });
    },
    prepare(input){
        return input.replace(/[A-Za-z0-9]/g, function(s) {
            return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
        });
    },
    assume(input,baseDate,tokenizer) {
        const preparedInput = this.prepare(input);
        return this.assumeFrom(tokenizer.tokenize(preparedInput), baseDate);
    },
    assumeFrom(tokens, baseDate) {
        let walker = new AssumeWalker();
        for (let token of tokens) {
            walker.acceptToken(token);
        }
        let container = walker.doAssume(new Date(baseDate.getTime()));
        console.log(`end assume. ${JSON.stringify(container)}`);
        return { output: container.toDates(baseDate).map(d => getDateString(d)), errors: walker.getErrors() };
    }
}

const isNumber = (item) => typeof item === 'number';

class AssumeWalker {
    constructor() {
        this.queue = [];
        this.errors = [];
    }
    getErrors() {
        return this.errors;
    }
    doAssume(baseDate) {
        let container = new Enumrate();
        let range = new Range();
        let date = new YearMonthDate();
        let index;
        console.log(JSON.stringify(this.queue));
        for (index in this.queue) {
            let next = this.queue[index];
            if(next.constructor == Object) {
                if(next.operator == Operator.DELTA_MONTH) {
                    date.acceptMonth(baseDate.getMonth() + next.delta + 1);
                    console.trace(date);
                }
                continue;
            }
            if (isNumber(next)) {
                date.acceptNumber(next);
                continue;
            }
            // 無視していい形態素。
            if (next === Operator.NO_OP) {
                continue;
            }
            if (next === Operator.ENUMRATE_NEXT) {
                range.close(date);
                container.ranges.push(range);
                range = new Range();
                date = new YearMonthDate();
                continue;
            }
            if (next === Operator.RANGE) {
                range.open(date);
                date = new YearMonthDate();
                continue;
            }
            if (next === Operator.RANGE_CLOSE) {
                range.close(date);
                container.ranges.push(range);
                range = new Range();
                date = new YearMonthDate();
                continue;
            }
            if (next.indexOf('yobi') >= 0) {
                range.acceptYobi(next);
                continue;
            }
            date.operate(next, baseDate);
        }
        range.close(date);
        container.ranges.push(range);
        container.assume(baseDate);
        return container;
    }
    acceptToken(token) {
        switch (token['pos']) {
            case '名詞':
            case '記号':
                this.acceptNoun(token);
                return;
            case '助詞':
                this.acceptParticle(token);
                return;
            default:
                this.acceptError(token);
                return;
        }
    }
    toNumber(str) {
        return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => {
            return String.fromCharCode(s.charCodeAt(0) - 65248);
        });
    }
    acceptNoun(token) {
        let str = token['surface_form'];
        if (token['pos_detail_1'] === '数' && !AssumeWalker.ENUMRATE_REGEX.test(str)) {
            this.acceptNumber(parseInt(this.toNumber(str)));
            return;
        }
        if (token['pos_detail_2'] === '助数詞') {
            this.acceptUnit(str);
            return;
        }
        if (token['pos_detail_1'] === '副詞可能') {
            this.manageTemporal(token);
            return;
        }
        if (str === '年') {
            this.acceptUnit(str);
            return;
        }
        if (AssumeWalker.FROM_TO_REGEX.test(str)) {
            this.queue.push(Operator.RANGE);
            return;
        }
        if (AssumeWalker.ENUMRATE_REGEX.test(str)) {
            this.queue.push(Operator.ENUMRATE_NEXT);
            return;
        }
        if (AssumeWalker.ANBIGUOUS_DATE_OPERATOR_REGEX.test(str)) {
            this.acceptUnit(str);
            return;
        }
        if (new RegExp(AssumeWalker.YOBI_REGEX_STR).test(str)) {
            this.acceptYobi(token);
            return;
        }
        this.acceptError(token);
        return;
    }
    acceptError(token) {
        this.errors.push(`${token['word_position']}番目の形態素「${token['surface_form']}」（原形:${token['basic_form']}、種別:${token['pos']} ${token['pos_detail_1']} ${token['pos_detail_2']}）がわかりませんでした。`);
    }
    manageTemporal(token) {
        let str = token['surface_form'];
        let regexArr = /([０-９]+)(.+)/g.exec(str);
        if (!regexArr) {
            this.acceptNearTemporal(str);
            if (new RegExp(AssumeWalker.YOBI_REGEX_STR).test(str)) {
                this.acceptYobi(token);
                return;
            }
            this.acceptError(token);
            return;
        }
        let num = regexArr[1];
        let unit = regexArr[2];
        this.acceptNumber(parseInt(this.toNumber(num)));
        this.acceptUnit(unit);
        return;
    }
    acceptNearTemporal(token){
        NearTemporalService.accept(token,this.queue);
    }
    acceptYobi(token) {
        let str = token['surface_form'];
        str = str.replace(/曜[日*]/g, '');
        let visitor = new RegExp(AssumeWalker.YOBI_REGEX_STR, 'g');
        let hit;
        while (hit = visitor.exec(str), hit != null) {
            switch (hit[1]) {
                case '月':
                    this.queue.push(Operator.MON);
                    break;
                case '火':
                    this.queue.push(Operator.TUE);
                    break;
                case '水':
                    this.queue.push(Operator.WED);
                    break;
                case '木':
                    this.queue.push(Operator.THU);
                    break;
                case '金':
                    this.queue.push(Operator.FRI);
                    break;
                case '土':
                    this.queue.push(Operator.SAT);
                    break;
                case '日':
                    this.queue.push(Operator.SUN);
                    break;
                default:
                    this.acceptError(token);
                    return;
            }
        }
    }
    acceptUnit(unit) {
        if (unit === '年') {
            this.queue.push(Operator.YEAR);
            return;
        }
        if (unit === '月') {
            this.queue.push(Operator.MONTH);
            return;
        }
        if (unit === '日') {
            this.queue.push(Operator.DAY);
            return;
        }
        if (unit === '/' || unit === '／') {
            this.queue.push(Operator.ANBIGUOUS_DATE_OPERATOR);
            return;
        }
        if (unit === '.' || unit === '．') {
            this.queue.push(Operator.ANBIGUOUS_DATE_OPERATOR);
            return;
        }
    }
    acceptNumber(n) {
        if (this.queue.length <= 0) {
            this.queue.push(n);
            return;
        }
        let last = this.queue.pop();
        if (isNumber(last)) {
            this.queue.push(parseInt(String(last) + String(n)));
            return;
        }
        this.queue.push(last);
        this.queue.push(n);
    }
    /**
     * 助詞をパースする
     * @param token
     */
    acceptParticle(token) {
        if (token['surface_form'] === 'から') {
            this.queue.push(Operator.RANGE);
            return;
        }
        if (token['surface_form'] === 'まで') {
            this.queue.push(Operator.RANGE_CLOSE);
            return;
        }
        if (token['surface_form'] === 'と') {
            this.queue.push(Operator.ENUMRATE_NEXT);
            return;
        }
        if (token['surface_form'] === 'の') {
            this.queue.push(Operator.NO_OP);
            return;
        }
        this.acceptError(token);
    }
}
AssumeWalker.FROM_TO_REGEX = /[-|～|~]/;
AssumeWalker.ANBIGUOUS_DATE_OPERATOR_REGEX = /[\/|.|／|．]/;
AssumeWalker.ENUMRATE_REGEX = /[,|、|，]/;
AssumeWalker.YOBI_REGEX_STR = '([月|火|水|木|金|土|日])';

const Operator = {
    "YEAR" : "year",
    "MONTH" : "month",
    "DAY" : "day",
    "RANGE" : "range",
    "ENUMRATE_NEXT" : "en",
    "RANGE_CLOSE" : "range_close",
    "ANBIGUOUS_DATE_OPERATOR" : "/",
    "NO_OP" : "no_op",
    "MON" : "yobi_mon",
    "TUE" : "yobi_tue",
    "WED" : "yobi_wed",
    "THU" : "yobi_thu",
    "FRI" : "yobi_fri",
    "SAT" : "yobi_sat",
    "SUN" : "yobi_sun",
    "DELTA_MONTH" : "deltaMonth",
    "DELTA_YEAR" : "deltaYear"
};
const Yobi = {
    yobi_mon: 1,
    yobi_tue: 2,
    yobi_wed: 3,
    yobi_thu: 4,
    yobi_fri: 5,
    yobi_sat: 6,
    yobi_sun: 0
};

class Enumrate {
    constructor() {
        this.ranges = [];
    }
    assume(baseDate) {
        let index;
        for (index in this.ranges) {
            let range = this.ranges[index];
            if (range.startDate.year) {
                baseDate.setDate(1);
                baseDate.setFullYear(range.startDate.year);
            }
            // 1月15日、16日、18日、・・・って場合を想定する。
            // この場合はbaseDateの日付は1日・・・になるのか？
            // 1月15日、2日、・・・って場合は1月なのかね。
            if (range.startDate.month) {
                baseDate.setDate(1);
                baseDate.setMonth(range.startDate.month - 1);
            }
            range.assume(baseDate);
        }
    }
    toDates(baseDate) {
        let ret = [];
        this.ranges.map(r => r.toDates(baseDate)).forEach(da => ret.push(...da));
        return ret;
    }
}

class Range {
    constructor() {
        this.yobis = [];
    }
    close(d) {
        if (!this.startDate) {
            this.startDate = YearMonthDate.clone(d);
        }
        this.endDate = YearMonthDate.clone(d);
    }
    open(startDate) {
        this.startDate = startDate;
    }
    acceptYobi(yobi) {
        this.yobis.push(Yobi[yobi]);
    }
    assume(baseDate) {
        this.startDate.assumeFromBaseDate(baseDate);
        // 当たり前だが、endDateはstartDateよりあとでないとダメなのでassumeの基準日はstartDate。
        this.endDate.assumeFromBaseDate(this.startDate.toDate());
        // なのだが、2018年12月15日～2017年11月14日みたいなinputだった場合どうするべきか？
        // 当然、逆転でしょう。
        if (this.endDate.toDate() < this.startDate.toDate()) {
            let s = this.startDate;
            let e = this.endDate;
            this.startDate = e;
            this.endDate = s;
        }
    }
    toDates(baseDate) {
        if (this.yobis.length > 0) {
            return this.toDatesWithYobi(baseDate);
        }
        let ret = [];
        let date = this.startDate.toDate();
        let limit = this.endDate.toDate();
        while (date <= limit) {
            ret.push(date);
            date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
        }
        return ret;
    }
    toDatesWithYobi(baseDate) {
        if (!this.startDate.date) {
            this.startDate.assumeDate(baseDate, true);
        }
        if (!this.endDate.date) {
            this.endDate.assumeDate(baseDate, false);
        }
        let ret = [];
        let date = this.startDate.toDate();
        let limit = this.endDate.toDate();
        while (date <= limit) {
            if (this.yobis.indexOf(date.getDay()) >= 0) {
                ret.push(date);
            }
            date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
        }
        return ret;
    }
}

class YearMonthDate {
    constructor() {
        this.date = 0;
    }
    static clone(origin) {
        let ret = new YearMonthDate();
        ret.year = origin.year;
        ret.month = origin.month;
        ret.working = origin.working;
        ret.date = origin.date;
        return ret;
    }
    acceptNumber(num) {
        this.working = num;
    }
    operate(operator, baseDate) {
        let working = this.working;
        this.working = 0;
        switch (operator) {
            case Operator.DAY:
                this.acceptDate(working, baseDate);
                return;
            case Operator.MONTH:
                this.acceptMonth(working);
                return;
            case Operator.YEAR:
                this.acceptYear(working);
                return;
            case Operator.ANBIGUOUS_DATE_OPERATOR:
                this.acceptAmbiguousThing(working, baseDate);
                return;
        }
        
        console.error(`${operator} is not cased...`);
    }
    acceptAmbiguousThing(num, baseDate) {
        // 精一杯頑張る。
        if (num > 1900) {
            this.acceptYear(num);
            return;
        }
        if (num < 13 && !this.month) {
            this.acceptMonth(num); // たぶん。。。自信ない。
        }
        this.acceptDate(num, baseDate);
    }
    acceptYear(year) {
        this.year = year;
    }
    acceptMonth(month) {
        this.month = month;
    }
    toDate() {
        return new Date(this.year, this.month - 1, this.date);
    }
    acceptDate(date, baseDate) {
        this.date = date;
    }
    assumeFromBaseDate(baseDate) {
        // この時点でworkingがあれば確実に日付なので、日付にしておく。
        if (this.working > 0) {
            this.acceptDate(this.working, baseDate);
        }
        if (!this.month) {
            this.month = this.assumeMonth(baseDate);
        }
        if (!this.year) {
            this.year = this.assumeYear(baseDate);
        }
    }
    assumeDate(baseDate, start) {
        let baseMonth = baseDate.getMonth() + 1;
        if (start) {
            this.date = baseMonth < this.month ? 1 : baseDate.getDate() + 1;
            return;
        }
        let endDate = new Date(this.year, this.month, 0).getDate();
        this.date = endDate;
    }
    assumeYear(baseDate) {
        let baseMonth = baseDate.getMonth() + 1;
        let baseYear = baseDate.getFullYear();
        // 今2018年12月15日で、予定が「1月15日」っていうインプットだった場合、十中八九2019年だよね。
        return baseMonth <= this.month ? baseYear : baseYear + 1;
    }
    assumeMonth(baseDate) {
        let baseMonth = baseDate.getMonth() + 1;
        let baseDay = baseDate.getDate();
        // 今1月15日で、予定が「2日」っていうインプットだった場合、十中八九2月2日だよね。
        // でも、dateが0だったら今月・・・むつかしい。
        if (!this.date) {
            return baseMonth;
        }
        return baseDay <= this.date ? baseMonth : baseMonth + 1;
    }
}