import * as React from 'react';
import BigNumber from 'bignumber.js';
import * as $ from 'jquery';
import {Glyphicon, Form, FormGroup, Col, FormControl, ListGroup, ListGroupItem, Panel, Popover, Tooltip, OverlayTrigger, Modal, Button, ButtonGroup, DropdownButton, MenuItem } from 'react-bootstrap';
import {BallotsRegistryInfo} from '../../blockchain/ballotsregistry';
import {BlockchainViewer} from '../../components/BlockchainViewer/index';
import {IBlockchainState} from '../../redux/reducers/blockchain/index';
import {TokenBallotInfo} from '../../blockchain/tokenballot';

const { connect } = require('react-redux');
const FontAwesome = require('react-fontawesome');
const s = require('./style.css');
const log = console.log;

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

    return (<div>
        <Panel className={s.chainPanel} header="Ballots">
          <ListGroup fill>
            { ballotsRegistry.ballots.forEach((ballot) => this.renderBallot(ballot)) }
          </ListGroup>
        </Panel>
      </div>);
  }

  private renderBallot(ballot:TokenBallotInfo) {
    return (<div key={ballot.address}/>);
  }
}

export { Home };
