import {ImmersiveToken, TokenInfo} from '../../../blockchain/immersivetoken';
import {ObjectMap} from '../../models/utils';
import {
  IImersiveActions, SET_ERROR, SET_FUNDED, SET_FUNDING_IN_PROGRESS, SET_TOKEN,
  UPDATE_BALANCE
} from '../../models/token';

export interface IImmersiveState {
  token?:TokenInfo;
  error?:string;
}

const initialState: IImmersiveState = {
  token:null,
  error:null
};

export function immersiveReducer(state = initialState, action?: IImersiveActions):IImmersiveState {

  if (!action) return state;

  const token = state.token;

  switch (action.type) {

    case SET_TOKEN:
      return <IImmersiveState> {...state, token:action.token };

    case UPDATE_BALANCE:
      if (state.token != null) token.balance = action.balance;
      return <IImmersiveState> {...state, token: token};


    case SET_FUNDED:
      if (token != null) token.balance = action.funded;
      return <IImmersiveState> {...state, token: token};


    case SET_FUNDING_IN_PROGRESS:
      if (token != null) token.fundingInProgress = action.inProgress;
      return <IImmersiveState> {...state, token:token};


    case SET_ERROR:
      return <IImmersiveState> {...state, error:action.error};

    default:
      return <IImmersiveState> state;
  }
}

