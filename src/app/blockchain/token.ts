import BigNumber from 'bignumber.js';
import * as ContractData from '../../contracts/IERC20Token.json';

import {Blockchain} from './blockchain';
import {TxCallback, TxContext} from './txcontext';

import {TimeUtils} from 'blockchain/utils';
import {ImmersiveTokenActions} from '../redux/models/token';

const contracts = require('truffle-contract');

const log = console.log;

export class TokenInfo {

  // immutable contract state
  public readonly address: string;
  public readonly name: string;
  public readonly symbol: string;

  public totalSupply: BigNumber;

  constructor(_address:string,
              _name:string,
              _totalSupply:BigNumber,
              _symbol: string) {

    this.name = _name;
    this.address = _address;
    this.totalSupply = _totalSupply;
    this.symbol = _symbol;
  }
}

export class Token {

  private readonly contract;
  private readonly address;

  private symbol: string;
  private name: string;
  private totalSupply: BigNumber;

  private tokenInfo; TokenInfo;

  public static async InitToken(address): Promise<Token> {

    log(`Initializing  token....`);
    const token = new Token(address);

    try {
      await token.init();
      return token;
    } catch (error) {
      log(`Init error: ${error}`);
      //(global as any).store.dispatch(ImmersiveTokenActions.setError(error));
      debugger;
      return null;
    }
  }

  private constructor(address) {
    const data = contracts(ContractData);
    data.setProvider(Blockchain.sharedInstance.web3.currentProvider);
    this.address = address;
    this.contract = data.at(this.address);
  }

  // async init
  private async init() {
    this.symbol = await this.contract.symbol();
    this.name = await this.contract.name();
    this.totalSupply = await this.contract.totalSupply();
    this.tokenInfo = new TokenInfo(this.address, this.name, this.symbol, this.totalSupply);

    const store = (global as any).store;

    //store.dispatch(ImmersiveTokenActions.setToken(tokenInfo));
  }

}

