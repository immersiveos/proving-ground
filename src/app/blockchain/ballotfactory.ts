import {BallotsRegistry} from './ballotsregistry';
import {TxCallback, TxContext, TxState} from './txcontext';
import {Blockchain} from './blockchain';

import * as TokenBallotContractData from '../../contracts/TokenBallot.json';
import {TokenBallot} from './tokenballot';
import {Token} from './token';
const contracts = require('truffle-contract');
const log = console.log;

export class NewBallotProposalData {
  public name: string;
  public infoUrl: string;
}

export class NewBallotData {
  public tokenAddress : string;
  public name : string;
  public infoUrl: string;
  public delegateAddress: string;
  public startTime: Date;
  public endTime: Date;
  public proposals = Array<NewBallotProposalData>();


  public get startBlockNumber() : number {
    const blockChain = Blockchain.sharedInstance;
    return blockChain.estimateBlockNumberFor(this.startTime)
  }

  public get endBlockNumber() : number {
    const blockChain = Blockchain.sharedInstance;
    return blockChain.estimateBlockNumberFor(this.endTime)
  }
}

export class BallotFactory {

  public static async createNewBallot (data: NewBallotData, registryAddress: string):Promise<boolean> {

    const ballot = await TokenBallot.Create(data);

    return new Promise<boolean>((resolve, reject) => {

      const blockChain = Blockchain.sharedInstance;
      const registry: BallotsRegistry = blockChain.contractsAbstractions[registryAddress] as BallotsRegistry;

      registry.registerNewBallot(ballot.address, 6, (context: TxContext) => {
        switch (context.state) {
          case TxState.Mined:
            log(`mined...`);
            break;
          case TxState.Error:
            log(`error... ${context.error}`);
            reject();
            break;
          case TxState.Pending:
            log(`pending...`);
            break;
          case TxState.OutOfGas:
            log(`out of gas...`);
            reject();
            break;
          case TxState.Confirmed:
            log(`confirmed!`);
            resolve(true);
            break;
          default:
            log(`Unexpected state`);
            break;
        }
      });
    });

  }
}
