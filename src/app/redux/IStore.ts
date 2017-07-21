import {IBlockchainState} from './reducers/blockchain/index';
import {IBallotsRegistryState} from './reducers/ballotsregistry/index';

export interface IStore {
  blockchain: IBlockchainState;
  ballotsRegistry: IBallotsRegistryState;
}
