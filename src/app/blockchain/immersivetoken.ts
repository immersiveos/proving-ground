import BigNumber from 'bignumber.js';
import * as ContractData from '../../contracts/ImmersiveToken.json';

import {Blockchain} from './blockchain';
import {TxCallback, TxContext} from './txcontext';

import {TimeUtils} from 'blockchain/utils';
import {ImmersiveTokenActions} from '../redux/models/token';

const appConfig = require('../../../config/main');
const contracts = require('truffle-contract');

const log = console.log;

export class ImmersiveTokenInfo {

  // immutable contract state
  public readonly address: string;
  public readonly name: string;
  public readonly symbol: string;
  public readonly owner: string;

  public readonly fundingGoal: BigNumber;
  public readonly fundingStartBlock: number;
  public readonly fundingEndBlock: number;

  // mutable contract state
  public balance: BigNumber;
  public funded?: boolean;
  public fundingInProgress:boolean;

  constructor(address:string, name:string, owner:string, fundingGoal:BigNumber, fundingStartBlock:BigNumber, fundingEndBlock:BigNumber, balance:BigNumber, symbol: string, funded?:boolean) {
    this.name = name;
    this.address = address;
    this.owner = owner;
    this.fundingGoal = fundingGoal;
    this.fundingStartBlock = fundingStartBlock;
    this.fundingEndBlock = fundingEndBlock;
    this.funded = funded;
    this.balance = balance;
    this.symbol = symbol;
  }
}

export class ImmersiveToken {

  public static sharedInstance;
  private readonly contract;
  private readonly address;

  public static async InitToken(): Promise<ImmersiveToken> {

    log(`Initializing  token....`);
    ImmersiveToken.sharedInstance = new ImmersiveToken();

    try {
      await ImmersiveToken.sharedInstance.init();
      return ImmersiveToken.sharedInstance;
    } catch (error) {
      log(`Init error: ${error}`);
      (global as any).store.dispatch(ImmersiveTokenActions.setError(error));
      debugger;
      return null;
    }
  }

  private constructor() {
    const data = contracts(ContractData);
    data.setProvider(Blockchain.sharedInstance.web3.currentProvider);
    this.address = appConfig.tokenAddress;
    this.contract = data.at(this.address);
  }

  private static UPDATE_INTERVAL = 17000;


  // async init
  private async init() {

    const owner = await this.contract.owner();
    const fundingStartBlock = await this.contract.fundingStartBlock();
    const fundingEndBlock = await this.contract.fundingEndBlock();
    const fundingGaol = await this.contract.fundingGoal();
    const funded = await this.contract.fundingSuccessful();
    const symbol = await this.contract.symbol();
    const name = await this.contract.name();
    const balance = await this.contract.totalSupply();

    const tokenInfo = new ImmersiveTokenInfo(this.address, name, owner, fundingGaol, fundingStartBlock, fundingEndBlock, balance, symbol, funded);

    // basic validation
    if (appConfig.tokenSymbol != symbol) throw new Error('Invalid token');

    const store = (global as any).store;

    store.dispatch(ImmersiveTokenActions.setToken(tokenInfo));

    setInterval(() => {
      this.updateTokenMutableState();
    }, ImmersiveToken.UPDATE_INTERVAL);
  }

  private async updateTokenMutableState() {

    const store = (global as any).store;

    const tokenInfo = store.getState().immersive.token;

    if (tokenInfo == null) return;

    const balance = await this.contract.totalSupply();
    const funded = await this.contract.fundingSuccessful();
    const inProgress = await this.contract.fundingInProgress();

    if (tokenInfo.balance == null || !balance.eq(tokenInfo.balance)) {
      store.dispatch(ImmersiveTokenActions.updateBalance(balance));
    }

    if (tokenInfo.funded != funded) {
      store.dispatch(ImmersiveTokenActions.setFunded(funded));
    }

    if (tokenInfo.fundingInProgress != inProgress) {
      store.dispatch(ImmersiveTokenActions.setFundingInProgress(inProgress));
    }
  }
}

