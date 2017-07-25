import {BallotsRegistryInfo, ADD_BALLOTS, IBallotRegistryAction, SET_REGISTRY} from '../../../blockchain/ballotsregistry';
const log = console.log;

export interface IBallotsRegistryState {
  registry?:BallotsRegistryInfo;
  error?:string;
}

const initialState: IBallotsRegistryState = {
  registry:null,
  error:null
};

export function ballotsRegistryReducer(state = initialState, action?: IBallotRegistryAction):IBallotsRegistryState {

  if (!action) return state;

  switch (action.type) {

    case SET_REGISTRY:
      log(`Set ballots registry address to: ${action.registry.address}`);
      return <IBallotsRegistryState> {...state, registry:action.registry };

    case ADD_BALLOTS:
      const registry = state.registry;
      const newReg = {...registry};

      for (let b of action.ballots) {
        newReg.ballots[b.address] = b;
      }
      return <IBallotsRegistryState> {...state, registry: newReg};

    default:
      return <IBallotsRegistryState> state;
  }
}
