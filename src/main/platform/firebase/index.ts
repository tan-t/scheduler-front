import * as functions from 'firebase-functions';

import EntryService from "@service/EntryService";
import AcceptTokens from "@domain/accept/AcceptTokens";
import NounAcceptor from "@domain/accept/noun/NounAcceptor";
import TemporalAcceptor from "@domain/accept/noun/temporal/TemporalAcceptor";
import RelativeTemporalAcceptor from "@domain/accept/noun/temporal/RelativeTemporalAcceptor";
import YobiAcceptor from "@domain/accept/noun/temporal/YobiAcceptor";
import NumberUnitAcceptor from "@domain/accept/noun/temporal/NumberUnitAcceptor";
import KuromojiService from "@service/KuromojiService";
import EnumrateAcceptor from "@domain/accept/noun/EnumrateAcceptor";
import NumericNounAcceptor from "@domain/accept/noun/NumericNounAcceptor";
import { NumberOperator, UnitOperator } from "@domain/operate/Operator";
import { Unit } from "@domain/accept/Unit";
import EnumrateOperator from "@domain/operate/EnumrateOperator";
import FromToAcceptor from "@domain/accept/noun/FromToAcceptor";
import AmbiguousDateAcceptor from "@domain/accept/noun/AmbiguousDateAcceptor";
import ParticleAcceptor from "@domain/accept/particle/ParticleAcceptor";
import AndAcceptor from "@domain/accept/particle/AndAcceptor";
import RangeStartAcceptor from "@domain/accept/particle/RangeStartAcceptor";
import RangeEndAcceptor from "@domain/accept/particle/RangeEndAcceptor";
import OutputService from '@service/OutputService';
import OperateDates from '@domain/operate/OperateDates';
import moment from 'moment';

const entryService = new EntryService(new AcceptTokens(new NounAcceptor(new TemporalAcceptor(new RelativeTemporalAcceptor, new YobiAcceptor(), new NumberUnitAcceptor()), new EnumrateAcceptor(), new NumericNounAcceptor(), new FromToAcceptor(), new AmbiguousDateAcceptor()), new ParticleAcceptor(new AndAcceptor(), new RangeStartAcceptor(), new RangeEndAcceptor())), new KuromojiService());
const outputService = new OutputService(new OperateDates());

module.exports.typeahead = functions.https.onRequest((request, response) => {
    const input = request.query['input'];
    const baseDateStr = request.query['baseDate'];
    const baseDate = baseDateStr ? moment(baseDateStr) : moment();
    entryService.entry(input).then(result=>{
        response.send(outputService.output(result.queue.getElements(),baseDate));
    });
});
