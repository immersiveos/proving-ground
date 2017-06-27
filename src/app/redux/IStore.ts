import {IBlockchainState} from './modules/blockchain/index';
import {IImmersiveState} from './modules/immersive/index';

export interface IStore {
  blockchain: IBlockchainState;
  immersive: IImmersiveState;
}
