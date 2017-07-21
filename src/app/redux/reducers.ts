import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { IStore } from './IStore';
import {blockchainReducer} from './reducers/blockchain/index';
import {ballotsRegistryReducer} from './reducers/ballotsregistry/index';

const { reducer } = require('redux-connect');

const rootReducer: Redux.Reducer<IStore> = combineReducers<IStore>({
  routing: routerReducer,
  blockchain: blockchainReducer,
  ballotsRegistry: ballotsRegistryReducer,
  reduxAsyncConnect: reducer,
});

export default rootReducer;
