import BigNumber from 'bignumber.js';

import * as TokenBallotContractData from '../../contracts/TokenBallotsRegistry.json';

import {Blockchain} from './blockchain';
import {TxCallback, TxContext} from './txcontext';

import {TimeUtils} from 'blockchain/utils';
import {ImmersiveTokenActions} from '../redux/models/token';
import {BallotProposalInfo, BallotProposal} from './ballotproposal';
import {start} from 'repl';

const appConfig = require('../../../config/main');
const contracts = require('truffle-contract');

const log = console.log;


export class BallotRegistryInfo {

}

export class BallotRegistry {

}
