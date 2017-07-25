import BigNumber from 'bignumber.js';
import * as TokenBallotRegistryData from '../../contracts/TokenBallotsRegistry.json';
import {Blockchain} from './blockchain';
import {TokenBallot, TokenBallotInfo} from './tokenballot';
import {TxCallback, TxContext} from './txcontext';

const contracts = require('truffle-contract');

const log = console.log;

export type SET_REGISTRY = 'ballots/SET_REGISTRY';
export const SET_REGISTRY: SET_REGISTRY = 'ballots/SET_REGISTRY';
export type SetRegistryAction = { type: SET_REGISTRY, registry:BallotsRegistryInfo};

export type ADD_BALLOTS = 'ballots/ADD_BALLOTS';
export const ADD_BALLOTS: ADD_BALLOTS = 'ballots/ADD_BALLOTS';
export type AddBallotsAction = { type: ADD_BALLOTS, ballots:Array<TokenBallotInfo>};

export class BallotRegistryActions {
  public static setRegistry(registry:BallotsRegistryInfo):SetRegistryAction {
    return <SetRegistryAction> { type: SET_REGISTRY , registry:registry };
  }
  public static addBallots(ballots:Array<TokenBallotInfo>):AddBallotsAction {
    return <AddBallotsAction> {type: ADD_BALLOTS, ballots: ballots};
  }
}

export type IBallotRegistryAction = SetRegistryAction | AddBallotsAction;

export class BallotsRegistryInfo {
  public readonly address;
  public ballots = new Map<string, TokenBallotInfo>();
  constructor(_address:string) {
    this.address = _address;
  }
}

export class BallotsRegistry {

  private readonly contract;
  private readonly address;

  private ballotsCount: BigNumber;
  private info: BallotsRegistryInfo;

  public static async InitBallotsRegistry(_address:string): Promise<BallotsRegistry> {
    const ballotRegistry = new BallotsRegistry(_address);
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

    // store a reference to this contract abstraction on the chain model
    const blockChain = Blockchain.sharedInstance;
    blockChain.contractsAbstractions[this.address] = this;
  }

  // async init
  private async init() {

    this.info = new BallotsRegistryInfo(this.address);
    const store = (global as any).store;

    // add registryInfo to redux (singleton for now)
    await store.dispatch(BallotRegistryActions.setRegistry(this.info));

    // update registry ballots
    await this.updateBallots();

    this.contract.BallotRegisteredEvent().watch((error, result) => {
      this.updateBallots();
    });
  }

  // register a new ballot
  public async registerNewBallot(ballotAddress, requestedConfirms:number, callback:TxCallback) {
    const blockChain = Blockchain.sharedInstance;
    const tx =  this.contract.addBallot(ballotAddress);
    const txContext = new TxContext(tx, requestedConfirms, callback);
    blockChain.processTransaction(txContext);
  }

  public async updateBallots() {
    this.ballotsCount = await this.contract.ballotsCount();
    for (let i=0; i < this.ballotsCount.toNumber(); i++) {
      const ballotAddress = await this.contract.ballots(i);
      const store = (global as any).store;
      const newBallots = Array<TokenBallotInfo>();

      if (!this.info.ballots.has(ballotAddress)) {
        const ballot = await TokenBallot.Init(ballotAddress, i);
        newBallots.push(ballot.info);
      }
      if (newBallots.length > 0) {
        store.dispatch(BallotRegistryActions.addBallots(newBallots));
      }
    }
  }
}
