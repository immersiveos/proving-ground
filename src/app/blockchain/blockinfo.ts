import BigNumber from 'bignumber.js';

const AVRG_BLOCK_TIME_MSECS = 17000;

export class BlockInfo {

  constructor(_block:any) {
    this.block = _block;
  }

  public readonly block: any;

  get blockTimeStamp():number {
    return this.block.timestamp;
  }

  get date(): Date {
    return new Date(this.block.timestamp * 1000);
  }

  get blockNumber():number {
    return this.block.number;
  }

  get blockHash():string {
    return this.block.hash;
  }

  // estimate the block number for a given time based on this block's timestamp
  public estimateBlockNumberFor(time:Date):number {
    const diffMs =  time.getTime() - this.date.getTime();
    const diffBlocks = diffMs / AVRG_BLOCK_TIME_MSECS;
    return this.blockNumber + diffBlocks;
  }
}

export class BlockchainError {
  public description: string;
  public advice: string;

  constructor(_desc, _advice) {
    this.description = _desc;
    this.advice = _advice;
  }
}



