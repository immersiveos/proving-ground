import * as React from 'react';
import BigNumber from 'bignumber.js';
const { connect } = require('react-redux');
const FontAwesome = require('react-fontawesome');
const s = require('./style.css');
const log = console.log;
import * as $ from 'jquery';

import {Glyphicon, Form, FormGroup, Col, FormControl, ListGroup, ListGroupItem, Panel, Popover, Tooltip, OverlayTrigger, Modal, Button, ButtonGroup, DropdownButton, MenuItem } from 'react-bootstrap';

import {BallotsRegistryInfo} from '../../blockchain/ballotsregistry';
import {BlockchainViewer} from '../../components/BlockchainViewer/index';
import {IBlockchainState} from '../../redux/reducers/blockchain/index';

interface IProps {
  blockchainState?: IBlockchainState;
  ballotsRegistry?: BallotsRegistryInfo;
  ballotsError? : string;
}

interface IState {
}

const initialState:IState = {
};

@connect(
  (state) => ({
    blockchainState: state.blockchain,
    ballotsRegistry: state.ballotsRegistry.registry,
    ballotsError: state.ballotsRegistry.error
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
    const {ballotsRegistry, ballotsError} = this.props;
    const loading = ballotsRegistry == null;
    const error = ballotsError != null;

    return (
      <div>
        { loading ? Home.renderBallotsLoading() : null }
        { error ? this.renderBallotsError() : null }
        { !loading && !error && ballotsRegistry != null ? this.renderRegistry() : null}

        <BlockchainViewer blockchaninState={this.props.blockchainState} />

      </div>
    );
  }

  private static renderBallotsLoading() {
    return (
      <div><Panel className={s.chainPanel} header="Ballots">
        <ListGroup fill>
          <ListGroupItem>Loading...</ListGroupItem>
        </ListGroup>
      </Panel></div>);
  }

  private renderBallotsError() {
    return (
      <div>
        <Panel className={s.chainPanel} header="Ballots">
          <ListGroup fill>
            <ListGroupItem>Error loaded ballots. ${this.props.ballotsError}</ListGroupItem>
          </ListGroup>
        </Panel></div>);
  }

  private renderRegistry() {

    const {ballotsRegistry, ballotsError} = this.props;

    //const now = new Date();
    //const ended = endDate.getTime() < now.getTime();
    //const endedDisp = ended ? "Endeed" : "Ends on";

    //const contractUrl = `https://etherscan.io/address/${token.address}`;

    return (<div/>);
    /*
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
    );*/
  }
}

export { Home };
