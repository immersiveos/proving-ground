import {Blockchain} from '../../blockchain/blockchain';
import {BlockchainError, BlockInfo} from '../../blockchain/blockinfo';

export type SET_BLOCK_CHAIN = 'blockchain/SET_BLOCK_CHAIN';
export const SET_BLOCK_CHAIN: SET_BLOCK_CHAIN = 'blockchain/SET_BLOCK_CHAIN';
export type SetBlockchainAction = { type: SET_BLOCK_CHAIN, chain:Blockchain };

export type SET_USER = 'blockchain/SET_USER';
export const SET_USER: SET_USER = 'blockchain/SET_USER';
export type SetUserAction = { type: SET_USER, userAccount?:string };

export type SET_CONNECTED = 'blockchain/SET_CONNECTED';
export  const SET_CONNECTED: SET_CONNECTED = 'blockchain/SET_CONNECTED';
export type SetConnectedAction = { type: SET_CONNECTED, connected:boolean };

export type SET_NETWORK_ID = 'blockchain/SET_NETWORK_ID';
export const SET_NETWORK_ID: SET_NETWORK_ID = 'blockchain/SET_NETWORK_ID';
export type SetNetworkIdAction = { type: SET_NETWORK_ID, id:number };

export type SET_LAST_BLOCK = 'blockchain/SET_LAST_BLOCK';
export const SET_LAST_BLOCK: SET_LAST_BLOCK = 'blockchain/SET_LAST_BLOCK';
export type SetLastBlockAction = { type: SET_LAST_BLOCK, block:BlockInfo };

export type SET_ERROR = 'blockchain/SET_ERROR';
export const SET_ERROR: SET_ERROR = 'blockchain/SET_ERROR';
export type SetErrorAction = { type: SET_ERROR, error?:BlockchainError };

export type SET_LAST_UPDATED = 'blockchain/SET_LAST_UPDATED';
export const SET_LAST_UPDATED: SET_LAST_UPDATED = 'blockchain/SET_LAST_UPDATED';
export type SetLastUpdated = { type: SET_LAST_UPDATED, date:Date };


export class BlockchainActions {

  public static setBlockchain(chain:Blockchain):SetBlockchainAction {
    return <SetBlockchainAction> { type: SET_BLOCK_CHAIN , chain:chain };
  }

  public static setUser(user?:string):SetUserAction {
    return <SetUserAction> { type: SET_USER , userAccount:user };
  }

  public static setConnected(connected:boolean):SetConnectedAction {
    return <SetConnectedAction> { type: SET_CONNECTED , connected:connected};
  }

  public static setNetworkId(id:number):SetNetworkIdAction {
    return <SetNetworkIdAction>{ type: SET_NETWORK_ID , id:id};
  }

  public static setLastBlock(block:BlockInfo):SetLastBlockAction {
    return <SetLastBlockAction> { type: SET_LAST_BLOCK , block:block};
  }

  public static setError(error?:BlockchainError):SetErrorAction {
    return <SetErrorAction> { type: SET_ERROR , error:error};
  }

  public static setLastUpdated(date:Date):SetLastUpdated {
    return <SetLastUpdated> { type: SET_LAST_UPDATED , date:date};
  }
}

export type IBlockchainAction =
  SetBlockchainAction |
  SetUserAction |
  SetConnectedAction |
  SetNetworkIdAction |
  SetLastBlockAction |
  SetErrorAction |
  SetLastUpdated;

