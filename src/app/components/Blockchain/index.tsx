import * as React from 'react';
import BigNumber from 'bignumber.js';
import {Blockchain} from '../../blockchain/blockchain';
const FontAwesome = require('react-fontawesome');
const s = require('./style.css');
const log = console.log;
import * as $ from 'jquery';

import {Glyphicon, Form, FormGroup, Col, FormControl, ListGroup, ListGroupItem, Panel, Popover, Tooltip, OverlayTrigger, Modal, Button, ButtonGroup, DropdownButton, MenuItem } from 'react-bootstrap';

import {Selectors} from 'redux/selectors';
import {BlockchainError, BlockInfo} from '../../blockchain/blockinfo';
import TimeAgo from 'react-timeago';
import {TxContext, TxState} from '../../blockchain/txcontext';
import {BlockchainUtils} from '../../blockchain/utils';
import {IBlockchainState} from '../../redux/reducers/blockchain/index';

interface IProps {
  blockchaninState: IBlockchainState;
}

interface IState {
}

const initialState:IState = {
};

class BlockchainViewer extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = initialState;
  }

  public render() {
    log('Rendering blockchain...');

    const state= this.props.blockchaninState;

    if (!state) return <div/>;

    const lastBlock = state.lastBlock;
    const lastError = state.error;
    const updated = state.updated;
    const userAccount = state.userAccount;
    const connected = state.connected;

    const status = connected ? "online" : "offline";
    const localUser = userAccount != null && userAccount.length > 0;

    return (
      <div>
        <Panel className={s.chainPanel} header="Blockchain">
          <ListGroup fill>
            {
              updated != null ? <ListGroupItem>
                  <FontAwesome name='clock-o' className={s.rm10}/>
                  Updated <TimeAgo date={updated}/>
                </ListGroupItem> :
                <ListGroupItem>Loading...</ListGroupItem>
            }

            {
              localUser ?
                <ListGroupItem>
                  <FontAwesome name='user-circle-o' className={s.rm10}/>

                  Wallet account: <a href="#">{BlockchainUtils.shortAddressFormat(state.userAccount)}</a>
                </ListGroupItem> :

                <ListGroupItem>
                  <FontAwesome name='info' className={s.rm10}/>
                  Wallet user not found or user account locked
                </ListGroupItem>

            }

            <ListGroupItem>
              <FontAwesome name='server' className={s.rm10}/>
              {BlockchainUtils.networkName(state.networkId)}
            </ListGroupItem>

            <ListGroupItem>
              <FontAwesome name='plug' className={s.rm10}/>
              Status: {status}
            </ListGroupItem>

            {
              lastError != null ?
                <ListGroupItem>
                  <FontAwesome name='info' className={s.rm10}/>
                  Last error: {lastError.description}</ListGroupItem>
                : null
            }
            <ListGroupItem>
              <FontAwesome name='cube' className={s.rm10}/>
              Last block: {
              lastBlock != null ?
                <span>{lastBlock.blockNumber.toString()} Mined <TimeAgo date={lastBlock.date}/>, {lastBlock.date.toString()}</span> : 'no block'
            }</ListGroupItem>
          </ListGroup>
        </Panel>
      </div>
    );
  }
}

export { BlockchainViewer };
