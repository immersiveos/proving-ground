import BigNumber from 'bignumber.js';
import {TxContext, TxState} from './txcontext';
import {BlockchainActions} from '../redux/models/blockchain';
import {BlockchainError, BlockInfo} from './blockinfo';
const Web3 = require('web3');
const log = console.log;
const localStore = require('store/dist/store.modern');

export class Blockchain {

  public static async InitBlockchain() {
    log(`Initializing  blockchain....`);
    Blockchain.sharedInstance = new Blockchain();
    await (global as any).store.dispatch(BlockchainActions.setBlockchain(Blockchain.sharedInstance));
  }

  public static sharedInstance;

  private web3;
  private userAccount;
  private networkId:number;
  private lastError?:BlockchainError;
  private lastBlock?: BlockInfo;
  private isConnected?: boolean;
  private trackedTransactions = new Map<string,TxContext>();

  private blockTimer;
  private userTimer;

  private static ABRG_BLOCK_TIME_MSECS = 17000;
  private static NETWORK_STATUS_INTERVAL = 5000;

  constructor() {

    try {
      // use injected web3 or create a new one listening to localhost if
      // it wasn't provided by the browser (mist/metamask)
      const providedWeb3 = (global as any).web3 || null;

      // Checking if Web3 has been injected by the browser (Mist/MetaMask)
      if (providedWeb3 !== null) {

        // Use Mist/MetaMask's provider
        this.web3 = new Web3(providedWeb3.currentProvider);
        log(`Using browser provided web3`);
      } else {
        log(`No browser provided web3 - trying local rpc...`);
        // fallback - use fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
      }

      this.startProcessing();

    } catch (exception) {
      log(`Failed to init web3: ${exception}`);
      this.setError(new BlockchainError("Failed to access Ethereum", "Please check your browser web3 provider"));
    }
  }

  private setError(error?:BlockchainError) {
    this.lastError = error;
    const store = (global as any).store;
    store.dispatch(BlockchainActions.setError(error));
    const isConnected = this.web3.isConnected();
    store.dispatch(BlockchainActions.setConnected(isConnected));
  }

  // if txContext.confirmations == 0 then callback with mined will be called
  // as soon as the transaction was mined, otherwise callback with confirmed will be sent after
  // the number of confirmations requested by the caller (>=1)
  public async processTransaction(txContext: TxContext) {

    txContext.request.then((res) => {

      if (res == null || res.receipt == null) {
        txContext.state = TxState.Error;
        txContext.error = 'Transaction failed - no receipt';
        txContext.performCallback();
        return;
      }

      txContext.result = res;
      txContext.state = TxState.Mined;

      // call the callback for the minted state
      txContext.performCallback();

      if (txContext.confirmations > 0) {
        // start tracking the transaction on the blockchain
        // if more than 1 confirmationa  requested
        // res.rx === res.receipt.transactionHash
        this.trackedTransactions.set(res.tx, txContext);
      }

    }).catch((err) => { // error (or timeout after 120 truffle-set)
      txContext.state = TxState.Error;
      txContext.error = err.message;
      txContext.performCallback();
    });

    // todo: listen to transaction events to catch transaction removed event
    // submit the transaction and log transaction hash
  }

  private async updateNetworkStatus () {

    const isConnected = this.web3.isConnected();

    if (isConnected != this.isConnected) {
      this.isConnected = isConnected;
      (global as any).store.dispatch(BlockchainActions.setConnected(isConnected));
    }

    this.web3.version.getNetwork((err, netId) => {

      if (err) {
        log(`Failed to get network id: ${err}`);
        this.setError(new BlockchainError("Failed to get Ethereum network", "Please check your browser web3 provider"));
        return;
      }

      const id = Number(netId);

      if (this.networkId != id) {
        this.networkId = id;
        switch (id) {
          case 1:
            log('This is mainnet');
            break;
          case 2:
            log('This is the deprecated modern test network.');
            break;
          case 3:
            log('This is the ropsten test network.');
            break;
          case NaN:
            log('Not connected to any network.');
            break;
          default:
            log(`Network id: ${id}`);
        }

        (global as any).store.dispatch(BlockchainActions.setNetworkId(this.networkId));
      }
    })
  }

  private async updateUser() {

    this.web3.eth.getAccounts( (err,res) => {

        if (err) {
          log(`Failed to get user account: ${err}`);
          (global as any).store.dispatch(BlockchainActions.setUser(null));
          return;
        }

        if (res.length == 0) {
          log(`No web3 accounts found`);
          (global as any).store.dispatch(BlockchainActions.setUser(null));
        }

        if (res[0] != this.userAccount) {
          this.userAccount = res[0];
          //log(`Eth user account: ${this.userAccount}`);
          (global as any).store.dispatch(BlockchainActions.setUser(this.userAccount));
        }

        //log(`Eth user account: ${this.userAccount}`);
    });
  }

  private async startProcessing() {
    // get the latest block number
    // get transactions in the block ????
    // look for transaction hash

    await this.updateNetworkStatus();
    await this.updateUser();
    await this.updateChain();

    this.userTimer = setInterval(() => {
      this.updateUser();
      this.updateNetworkStatus();
    }, Blockchain.NETWORK_STATUS_INTERVAL);

    this.blockTimer = setInterval(() => {
      this.updateChain()
    }, Blockchain.ABRG_BLOCK_TIME_MSECS);

    //const store = (global as any).store;
    //const state = store.getState();
  }


  public estimatedBlockDate(blockNumber:number):Date {
    if (this.lastBlock == null) {
      log(`Warning: no last block yet`);
      return null;
    }
    const diff = blockNumber - this.lastBlock.blockNumber;
    const msecs = diff * Blockchain.ABRG_BLOCK_TIME_MSECS;
    return new Date (this.lastBlock.date.getTime() + msecs);
  }

  public estimatedBigNumberBlockDate(blockNumber:BigNumber):Date {
    if (this.lastBlock == null) {
      log(`Warning: no last block yet`);
      return null;
    }
    const diff = blockNumber.minus(this.lastBlock.blockNumber);
    const msecs = diff * Blockchain.ABRG_BLOCK_TIME_MSECS;
    return new Date (this.lastBlock.date.getTime() + msecs);
  }


  // Transactions tracking
  // due to lack of common support for eth_newPendingTransactionFilter and the alpha status of
  // https://github.com/MetaMask/provider-engine
  // See: https://github.com/MetaMask/provider-engine/issues/23

  private updateChain () {

    log(`Processing...`);

    this.web3.eth.getBlock('latest', false, (error, block) => {

      if (error) {
        log(`Error getting latest block from blockchain. Error description: ${error}`);
        this.setError(new BlockchainError("Failed to access Ethereum", "Please check your browser web3 provider and reload this page"));
        return;
      }

      log(`Got block ${block.number}`);

      (global as any).store.dispatch(BlockchainActions.setLastUpdated(new Date()));

      if (this.lastBlock != null && block.hash === this.lastBlock.blockHash) {
        log(`Current block ${block.number} hash: ${block.hash}. Last block ${this.lastBlock.blockNumber} hash: ${this.lastBlock.blockHash}`);
        log (`already processed this block.`);
        return;
      }

      this.lastBlock = new BlockInfo(block);

      (global as any).store.dispatch(BlockchainActions.setLastBlock(this.lastBlock));

      this.trackedTransactions.forEach((context:TxContext, key:string) => {

        const confirms = block.number - context.blockNumber;

        if (confirms >= context.confirmations) {

          // try getting a receipt for the transaction from the current blockchain

          this.web3.eth.getTransactionReceipt(context.result.tx, (error, receipt) => {

            if (error || receipt == null) {
              if (error) context.error = error;
              context.state = TxState.Error;
              context.performCallback();
              this.trackedTransactions.delete(key);

            } else {

              if (receipt.gasUsed >= context.result.gas) {
                // ran out of gas or contract threw an exception and used all the provided gas
                // note edge case when transaction cost the exact amount of gas provided - ether open issue
                context.state = TxState.OutOfGas;
                this.trackedTransactions.delete(key);
                context.performCallback();
                return;
              }

              context.state = TxState.Confirmed;
              this.trackedTransactions.delete(key);
              context.performCallback();
            }

          });
        }
      });
    });
  }

  public getEthAmountString(amount:BigNumber): string {
    return (`${this.web3.fromWei(amount)} eth`);
  }

  public getWeiString(amount:BigNumber): string {
    return (`${amount.toFixed(0)} wei (${this.web3.fromWei(amount)} eth)`);
  }

}

