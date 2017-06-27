import BigNumber from 'bignumber.js';
const log = console.log;

export class ContractEvent {
  public name: string;
  public value: any;
  constructor(_name,_data) {
    this.name = _name;
    this.value = _data;
  }
}

export type TxCallback = (context:TxContext) => void;

export enum TxState {
  Pending,
  Error,
  OutOfGas,
  Mined,
  Confirmed
}

export class TxContext {

  constructor(_rquest: any, _confirms: number, _callback?:TxCallback) {
    this.request = _rquest;
    this.confirmations = _confirms;
    this.callback = _callback;
  }

  // the transaction call object
  readonly request: any;

  public readonly confirmations: number;
  private readonly callback?:TxCallback;

  public state:TxState = TxState.Pending;

  public error: any;
  public result: any;

  public get blockNumber(): number {
    return this.result.receipt.blockNumber;
  }

  public get gasUsed(): number {
    return this.result.receipt.gasUsed;
  }

  public get logs(): any[] {
    return this.result.logs;
  }

  public get transactionHash():string {
    return this.result.receipt.transactionHash;
  }

  public performCallback () {
    if (this.callback == null) return;
    this.callback(this);
  }

  public get events(): ContractEvent[] {

    const res = [];

    for (let i = 0; i < this.result.logs.length; i++) {
      const data = this.result.logs[i];
      res.push(new ContractEvent(data.event,data.args));
    }
    return res;
  }

  public logEvents() {
    for (let i = 0; i < this.result.logs.length; i++) {
      const l = this.result.logs[i];
      log(l.event + ":");
      log(l.args);
    }
  }
}



//export { web3, lobby, contracts };

