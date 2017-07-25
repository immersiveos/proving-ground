import BigNumber from 'bignumber.js';
import * as TokenBallotContractData from '../../contracts/TokenBallot.json';
import {Blockchain} from './blockchain';
import {TxCallback, TxContext, TxState} from './txcontext';
import {TimeUtils} from 'blockchain/utils';
import {BallotProposalInfo, BallotProposal} from './ballotproposal';
import {start} from 'repl';
import {Token} from './token';
import {NewBallotData} from './ballotfactory';

const appConfig = require('../../../config/main');
const contracts = require('truffle-contract');
const log = console.log;

export class TokenBallotInfo {

  public readonly address: string;
  public readonly name: string;
  public readonly owner: string;
  public readonly infoUrl: string;

  public readonly tokenAddress: string;
  public readonly delegate: string;

  public readonly startBlock: number;
  public readonly endBlock: number;

  public readonly proposals = Array<BallotProposalInfo>();

  public totalVotes: number;

  constructor(_address:string, _name:string ,_owner:string,_infoUrl:string,
               _tokenAddress:string,_delegate:string,_startBlock:number,_endBlock:number, _totalVotes:number) {
    this.address = _address;
    this.name = _name;
    this.owner = _owner;
    this.infoUrl = _infoUrl;
    this.tokenAddress = _tokenAddress;
    this.delegate = _delegate;
    this.startBlock = _startBlock;
    this.endBlock = _endBlock;
    this.totalVotes = _totalVotes;
  }
}

export class TokenBallot {

  private readonly contract;
  public readonly address: string;
  public readonly id: number;

  private startBlock: number;
  private endBlock: number;

  private name : string;
  private owner: string;
  private infoUrl: string;

  private tokenAddress: string;
  private token:Token;

  private delegate: string;

  private proposals = Array<BallotProposal>();

  private totalVotes: number;
  private finalized: boolean;

  public info:TokenBallotInfo;

  public static async Init(address:string, id:number): Promise<TokenBallot> {

    log(`Initializing  token ballot....`);
    const instance = new TokenBallot(address, id);

    try {
      await instance.init();
      return instance;
    } catch (error) {
      log(`Init error: ${error}`);
      //(global as any).store.dispatch(ImmersiveTokenActions.setError(error));
      debugger;
      return null;
    }
  }

  // create a new ballot from user provided data
  public static async Create(data:NewBallotData):Promise<TokenBallot> {
    try {
      const contractData = contracts(TokenBallotContractData);
      contractData.setProvider(Blockchain.sharedInstance.web3.currentProvider);

      // todo: how can we wait for 5 confirms after this block?
      // we need the transaction data for the contract creation

      const ballotAddress = await contractData.new(
        data.name,
        data.tokenAddress,
        data.startBlockNumber,
        data.endBlockNumber,
        data.delegateAddress,
        data.infoUrl);

      const tokenBallot = await TokenBallot.Init(ballotAddress, 0);

      for (let p of data.proposals) {
        const proposal = await BallotProposal.Create(p, ballotAddress);
        await tokenBallot.addNewProposal(proposal);
      }

      // read the the newly added proposals from the blockchain
      await tokenBallot.updateProposals();

      return tokenBallot;

    } catch (err) {
      log(`Create error: ${err}`);
    }
  }

  private constructor(address, id) {
    const data = contracts(TokenBallotContractData);
    data.setProvider(Blockchain.sharedInstance.web3.currentProvider);
    this.address = address;
    this.id = id;
    this.contract = data.at(address);
  }

  private async addNewProposal(proposal:BallotProposal):Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const blockChain = Blockchain.sharedInstance;
      const tx = this.contract.addPropsal(proposal.address);
      const txContext = new TxContext(tx, 3, (context: TxContext) => {
        switch (context.state) {
          case TxState.Mined:
            log(`mined...`);
            break;
          case TxState.Error:
            log(`error... ${context.error}`);
            reject(context.error);
            break;
          case TxState.Pending:
            log(`pending...`);
            break;
          case TxState.OutOfGas:
            log(`out of gas...`);
            reject('out of gas');
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

      blockChain.processTransaction(txContext);
    });
  }

  // async init
  private async init() {

    this.owner = await this.contract.owner();
    this.name = await this.contract.name();
    this.infoUrl = await this.contract.infoUrl();
    this.startBlock = await this.contract.startBlock();
    this.endBlock = await this.contract.endBlock();
    this.delegate = await this.contract.finalizationDelegate();

    this.totalVotes = this.contract.totalVotes();

    this.tokenAddress = await this.contract.token();
    this.token = await Token.InitToken(this.tokenAddress);

    this.info = new TokenBallotInfo(
      this.address,
      this.name,
      this.owner,
      this.infoUrl,
      this.infoUrl,
      this.delegate,
      this.startBlock,
      this.endBlock,
      this.totalVotes
    );

    // todo: add the info to redux here

    await this.updateProposals();
    await this.updateFinalResults();

    const store = (global as any).store;

    // todo: start watching events here

    this.contract.ProposalAddedEvent().watch((error, result) => {
      this.updateProposals();
    });

    this.contract.BallotFinalizedEvent().watch((error, result) => {
      this.updateFinalResults();
    });

    this.contract.VoteEvent().watch((error, result) => {
      this.updateTotalVotes();
    });

    this.contract.UnVoteEvent().watch((error, result) => {
      this.updateTotalVotes();
    });
  }

  private async updateTotalVotes() {
    this.totalVotes = this.contract.totalVotes();

    //todo: fire redux event
  }

  private async updateFinalResults() {
    this.finalized = await this.contract.votesFinalized();

    // todo: update redux state
  }

  private async updateProposals() {

    const proposalsCount = await this.contract.proposalsCount();
    this.proposals.length = 0;
    for (let i=0; i < proposalsCount; i++) {
      const proposalAddress = await this.contract.proposalsArray(i);
      const proposal = await BallotProposal.InitProposal(proposalAddress);
      this.proposals.push(proposal);
    }

    //todo: update redux state

  }

}

