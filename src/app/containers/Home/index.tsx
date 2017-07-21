import * as React from 'react';
import BigNumber from 'bignumber.js';
import {Blockchain} from '../../blockchain/blockchain';
const { connect } = require('react-redux');
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
import {TokenInfo} from '../../blockchain/immersivetoken';

interface IProps {
  userAccount: string;
  networkId: number;
  lastBlock?: BlockInfo;
  connected: boolean;
  lastError?: BlockchainError;
  updated?: Date;
  token?: TokenInfo;
  tokenError? : string;
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
    tokenError: state.immersive.error
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
    const {token, tokenError} = this.props;
    const loading = token == null;
    const error = tokenError != null;

    return (
      <div>
        { loading ? this.renderTokenLoading() : null }
        { error ? this.renderTokenError() : null }
        { !loading && !error && token != null ? this.renderTokenInfo() : null}
        { this.renderBlockchainInfo() }
      </div>
    );
  }

  private renderTokenLoading() {
    return (
      <div><Panel className={s.chainPanel} header="Crowdsale Info">
        <ListGroup fill>
          <ListGroupItem>Loading...</ListGroupItem>
        </ListGroup>
      </Panel></div>);
  }

  private renderTokenError() {
    return (
      <div>
        <Panel className={s.chainPanel} header="Crowdsale Info">
          <ListGroup fill>
            <ListGroupItem>Error loaded token. ${this.props.tokenError}</ListGroupItem>
          </ListGroup>
        </Panel></div>);
  }

  private renderTokenInfo() {

    const {token, tokenError} = this.props;

    const blockchain = Blockchain.sharedInstance;
    const startedDate = blockchain.estimatedBlockDate(token.fundingStartBlock);
    const endDate = blockchain.estimatedBlockDate(token.fundingEndBlock);
    const balance = blockchain.getEthAmountString(token.balance);
    const fundingGaol = blockchain.getEthAmountString(token.fundingGoal);

    const successful = token.funded != null && token.funded == true;
    const failed = token.funded != null && token.funded == false;

    const now = new Date();
    const ended = endDate.getTime() < now.getTime();
    const endedDisp = ended ? "Endeed" : "Ends on";

    const contractUrl = `https://etherscan.io/address/${token.address}`;

    return (
      <div>
        <Panel className={s.chainPanel} header="ImmersiveToken Token Sale">
          <ListGroup fill>

            <ListGroupItem>Started: <TimeAgo date={startedDate}/>&nbsp;(Block {token.fundingStartBlock.toString()})</ListGroupItem>

            <ListGroupItem>Funding goal: {fundingGaol}</ListGroupItem>

            <ListGroupItem>Raised: {balance}</ListGroupItem>

            <ListGroupItem>Address:&nbsp;
              <a href={contractUrl} target="_blank">{BlockchainUtils.shortAddressFormat(token.address)}</a>
            </ListGroupItem>

            <ListGroupItem>{endedDisp} <TimeAgo date={endDate}/>&nbps;(Block {token.fundingEndBlock.toString()})</ListGroupItem>

            { successful ?
              <ListGroupItem>Successful! thanks for your support</ListGroupItem> : null
            }

            { failed ?
              <ListGroupItem>Campaign was not successful :-( thanks for your support - you may withdraw your
                contribution</ListGroupItem> : null
            }
          </ListGroup>
        </Panel>
      </div>
    );
  }

  private renderBlockchainInfo() {

    const {lastBlock, lastError, updated, userAccount} = this.props;

    const status = this.props.connected ? "online" : "offline";

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

                  Wallet account: <a href="#">{BlockchainUtils.shortAddressFormat(this.props.userAccount)}</a>
                </ListGroupItem> :

                <ListGroupItem>
                  <FontAwesome name='info' className={s.rm10}/>
                  Wallet user not found or user account locked
                </ListGroupItem>

            }

            <ListGroupItem>
              <FontAwesome name='server' className={s.rm10}/>
              {BlockchainUtils.networkName(this.props.networkId)}
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

export { Home };
