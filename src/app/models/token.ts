import BigNumber from 'bignumber.js';
import {TokenInfo} from '../blockchain/immersivetoken';

export type SET_TOKEN = 'token/SET_TOKEN';
export const SET_TOKEN: SET_TOKEN = 'token/SET_TOKEN';
export type SetTokenAction = { type: SET_TOKEN, token:TokenInfo};

export type UPDATE_BALANCE = 'token/UPDATE_BALANCE';
export const UPDATE_BALANCE: UPDATE_BALANCE = 'token/UPDATE_BALANCE';
export type UpdateBalanceAction = { type: UPDATE_BALANCE, balance:BigNumber};

export type SET_FUNDED = 'token/SET_FUNDED';
export const SET_FUNDED: SET_FUNDED = 'token/SET_FUNDED';
export type SetFundedAction = { type: SET_FUNDED, funded:boolean};

export type SET_FUNDING_IN_PROGRESS = 'token/SET_FUNDING_IN_PROGRESS';
export const SET_FUNDING_IN_PROGRESS: SET_FUNDING_IN_PROGRESS = 'token/SET_FUNDING_IN_PROGRESS';
export type SetFundingInProgressAction = { type: SET_FUNDING_IN_PROGRESS, inProgress:boolean};

export type SET_ERROR = 'token/SET_ERROR';
export const SET_ERROR: SET_ERROR = 'token/SET_ERROR';
export type SetErrorAction = { type: SET_ERROR, error:string};


export class ImmersiveTokenActions {

  public static setToken(token:TokenInfo):SetTokenAction {
    return <SetTokenAction>{ type: SET_TOKEN , token:token};
  }

  public static updateBalance(balance:BigNumber):UpdateBalanceAction {
    return <UpdateBalanceAction>{ type: UPDATE_BALANCE , balance:balance};
  }

  public static setFunded(funded:boolean):SetFundedAction {
    return <SetFundedAction>{ type: SET_FUNDED , funded:funded};
  }

  public static setFundingInProgress(inProgress:boolean):SetFundingInProgressAction {
    return <SetFundingInProgressAction>{ type: SET_FUNDING_IN_PROGRESS , inProgress:inProgress};
  }

  public static setError(error:string):SetErrorAction {
    return <SetErrorAction>{ type: SET_ERROR , error:error};
  }
}

export type IImersiveActions = SetTokenAction |
  UpdateBalanceAction |
  SetFundedAction |
  SetFundingInProgressAction |
  SetErrorAction;


