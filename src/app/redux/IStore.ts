import {IBlockchainState} from './reducers/blockchain/index';
import {IImmersiveState} from './reducers/immersive/index';

export interface IStore {
  blockchain: IBlockchainState;
  immersive: IImmersiveState;
}
