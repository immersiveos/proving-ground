import {
  IBlockchainAction,
  SET_BLOCK_CHAIN, SET_CONNECTED, SET_ERROR, SET_LAST_BLOCK, SET_LAST_UPDATED, SET_NETWORK_ID, SET_USER
} from '../../models/blockchain';
import {Blockchain} from '../../../blockchain/blockchain';
import {BlockchainError, BlockInfo} from 'blockchain/blockinfo';

export interface IBlockchainState {
  userAccount?: string;
  networkId:number;
  connected:boolean;
  error?: BlockchainError;
  lastBlock?: BlockInfo;
  updated?:Date;
}

const initialState: IBlockchainState = {
  userAccount:null,
  networkId:0,
  connected:false,
  error:null,
  lastBlock:null,
  updated:null
};

/** Reducer: CounterReducer */
export function blockchainReducer(state = initialState, action?: IBlockchainAction):IBlockchainState {

  if (!action) return state;

  switch (action.type) {

    case SET_USER:
      return <IBlockchainState> {...state, userAccount:action.userAccount };

    case SET_CONNECTED:
      return <IBlockchainState> {...state, connected:action.connected };

    case SET_LAST_BLOCK:
      return <IBlockchainState> {...state, lastBlock:action.block };

    case SET_NETWORK_ID:
      return <IBlockchainState> {...state, networkId:action.id };

    case SET_ERROR:
      return <IBlockchainState> {...state, error:action.error };

    case SET_LAST_UPDATED:
      return <IBlockchainState> {...state, updated:action.date };

    default:
      return <IBlockchainState> state;
  }
}
