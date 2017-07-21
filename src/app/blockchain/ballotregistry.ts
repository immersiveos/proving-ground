import BigNumber from 'bignumber.js';

import * as TokenBallotRegistryData from '../../contracts/TokenBallotsRegistry.json';

import {Blockchain} from './blockchain';
import {TxCallback, TxContext} from './txcontext';

import {TimeUtils} from 'blockchain/utils';
import {ImmersiveTokenActions} from '../redux/models/token';
import {BallotProposalInfo, BallotProposal} from './ballotproposal';
import {start} from 'repl';
import {TokenBallot, TokenBallotInfo} from './tokenballot';
import {forEachToken} from 'tslint';

const appConfig = require('../../../config/main');
const contracts = require('truffle-contract');

const log = console.log;


export class BallotRegistryInfo {

  public readonly address;

  public ballots = new Map<string, TokenBallotInfo>();

  constructor(_address:string) {
    this.address = _address;
  }
}

export class BallotRegistry {

  private readonly contract;
  private readonly address;

  private ballotsCount: BigNumber;
  private ballots = new Map<string,TokenBallot>();
  private info: BallotRegistryInfo;
  public static async InitProposal(_address:string): Promise<BallotRegistry> {

    const ballotRegistry = new BallotRegistry(_address);

    try {
      await ballotRegistry.init();
      return ballotRegistry;
    } catch (error) {
      log(`Init error: ${error}`);
      //(global as any).store.dispatch(ImmersiveTokenActions.setError(error));
      debugger;
      return null;
    }
  }

  private constructor(_address:string) {
    const data = contracts(TokenBallotRegistryData);
    data.setProvider(Blockchain.sharedInstance.web3.currentProvider);
    this.address = _address;
    this.contract = data.at(this.address);
  }

  // async init
  private async init() {

    this.updateBallots();


    this.info = new BallotRegistryInfo(this.address);

    for (let b of this.ballots.values()) {
      if (!this.info.ballots.has(b.address)) {
        this.info.ballots[b.address] = b.info;
      }
    }

    const store = (global as any).store;

    // todo: add registry info to store here

    this.contract.BallotRegisteredEvent().watch((error, result) => {
      this.updateBallots();
    });

  }

  private async updateBallots() {

    this.ballotsCount = await this.contract.ballotsCount();

    for (let i=0; i < this.ballotsCount.toNumber(); i++) {

      const ballotAddress = await this.contract.ballots(i);

      if (!this.ballots.has(ballotAddress)) {
        this.ballots[ballotAddress] = await TokenBallot.Init(ballotAddress, i);;

        // todo: update redux state
      }
    }

  }

}
