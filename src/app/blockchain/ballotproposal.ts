import BigNumber from 'bignumber.js';
import * as BallotProposalContractData from '../../contracts/BallotProposal.json';
import {Blockchain} from './blockchain';

const contracts = require('truffle-contract');
const log = console.log;

export class BallotProposalInfo {

  public readonly address;
  public readonly name: string;
  public readonly infoUrl: string;
  public readonly ballotAddress: string;

  public readonly finalized: boolean;
  public readonly finalVoters: number;
  public readonly finalVotedTokens: BigNumber;

  public readonly currentVoters: number;

  constructor(_address:string,
              _name:string,
              _infoUrl:string,
              _ballotAddress:string,
              _finalized:boolean,
              _finalVoters:number,
              _finalVotedTokens:BigNumber,
              _currentVoters:number
              ) {

    this.name = _name;
    this.address = _address;
    this.infoUrl = _infoUrl;
    this.ballotAddress = _ballotAddress;
    this.finalized = _finalized;
    this.finalVotedTokens = _finalVotedTokens;
    this.finalVoters = _finalVoters;
    this.currentVoters = _currentVoters;
  }
}

export class BallotProposal {
  private readonly contract;
  private readonly address;

  private name: string;
  private infoUrl: string;
  private ballotAddress: string;
  private finalized: boolean;
  private finalVoters: number;
  private finalVotedTokens: BigNumber;

  private currentVoters: number;

  private info: BallotProposalInfo;

  public static async InitProposal(address:string): Promise<BallotProposal> {

    const proposal = new BallotProposal(address);

    try {
      await proposal.init();
      return proposal;
    } catch (error) {
      log(`Init error: ${error}`);
      //(global as any).store.dispatch(ImmersiveTokenActions.setError(error));
      debugger;
      return null;
    }
  }

  private constructor(address:string) {
    const data = contracts(BallotProposalContractData);
    data.setProvider(Blockchain.sharedInstance.web3.currentProvider);
    this.address = address;
    this.contract = data.at(this.address);
  }

  // async init
  private async init() {

    this.name = await this.contract.name();
    this.infoUrl = await this.contract.infoUrl();
    this.ballotAddress = await this.contract.ballotAddress();

    this.finalized = await this.contract.finalized();
    this.finalVoters = await this.contract.finalVoters();
    this.finalVotedTokens = await this.contract.finalVotedTokens();

    this.currentVoters = await this.contract.votersCount();

    const store = (global as any).store;

    this.info = new BallotProposalInfo(
        this.address,
        this.name,
        this.infoUrl,
        this.ballotAddress,
        this.finalized,
        this.finalVoters,
        this.finalVotedTokens,
        this.currentVoters
      );

    // todo: add it to the state via dispatch

    this.contract.VoteEvent().watch((error, result) => {
      this.updateVotes();
    });

    this.contract.UndoVoteEvent().watch((error, result) => {
      this.updateVotes();
    });

    this.contract.FinalResultsEvent().watch((error, result) => {
      this.processFinalResults();
    });
  }

  private async processFinalResults () {

    this.finalized = await this.contract.finalized();
    this.finalVoters = await this.contract.finalVoters();
    this.finalVotedTokens = await this.contract.finalVotedTokens();

    // todo: dispatch event to update the proposal info in redux
  }

  private async updateVotes () {
    this.currentVoters = await this.contract.votersCount();
    // todo: dispatch event to update the ballot proposal info here
  }

}
