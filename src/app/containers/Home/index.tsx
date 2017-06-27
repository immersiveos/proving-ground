import * as React from 'react';
import BigNumber from 'bignumber.js';
import {Blockchain} from '../../blockchain/blockchain';
const { connect } = require('react-redux');
const s = require('./style.css');
const log = console.log;
import * as $ from 'jquery';

import {Form, FormGroup, Col, FormControl, ListGroup, ListGroupItem, Panel, Popover, Tooltip, OverlayTrigger, Modal, Button, ButtonGroup, DropdownButton, MenuItem } from 'react-bootstrap';

import {Selectors} from 'redux/selectors';
import {BlockchainError, BlockInfo} from '../../blockchain/blockinfo';
import TimeAgo from 'react-timeago';
import {TxContext, TxState} from '../../blockchain/txcontext';
import {BlockchainUtils} from '../../blockchain/utils';
import {TokenInfo} from '../../blockchain/immersivetoken';

interface IProps {
  userAccount: string;
  networkId: number;
  lastBlock?: BlockInfo;
  connected: boolean;
  lastError?: BlockchainError;
  updated?: Date;

  token?: TokenInfo;

}

interface IState {
}

const initialState:IState = {
};

@connect(
  (state) => ({
    userAccount: state.blockchain.userAccount,
    networkId: state.blockchain.networkId,
    lastBlock: state.blockchain.lastBlock,
    connected: state.blockchain.connected,
    lastError: state.blockchain.lastError,
    updated: state.blockchain.updated,

    token: state.immersive.token,

  }),
  (dispatch) => ({

  }),
)
class Home extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = initialState;
  }

  public render() {

    log('Rendering home...');

    return (
      <div>
        { this.renderBlockchainInfo() }
      </div>
    );
  }

  private renderBlockchainInfo() {
    const {lastBlock, lastError, updated} = this.props;

    const status = this.props.connected ? "online" : "offline";

    return (
      <div>
        <Panel className={s.chainPanel} header="Blockchain Info">
          <ListGroup fill>
            {
              updated != null ? <ListGroupItem>Updated <TimeAgo date={updated}/></ListGroupItem> :
                <ListGroupItem>Loading...</ListGroupItem>
            }

            <ListGroupItem>User Account: {BlockchainUtils.shortAddressFormat(this.props.userAccount)}</ListGroupItem>
            <ListGroupItem>Network Id: {this.props.networkId}</ListGroupItem>

            <ListGroupItem>Status: {status}</ListGroupItem>

            {
              lastError != null ?
                <ListGroupItem>Last error: {lastError.description}</ListGroupItem>
                : null
            }
            <ListGroupItem>Last block: {
              lastBlock != null ?
                <span>{lastBlock.blockNumber.toString()}. Block time: <TimeAgo date={lastBlock.date}/>, {lastBlock.date.toString()} </span> : 'no block'
            }</ListGroupItem>
          </ListGroup>
        </Panel>
      </div>
    );
  }
}

export { Home };
