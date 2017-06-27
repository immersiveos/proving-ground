import * as React from 'react';
import { Link } from 'react-router';
import * as ReactBoostrap from 'react-bootstrap';

import {Alert, Glyphicon, ControlLabel, Form, FormGroup, Col, FormControl, ListGroup, ListGroupItem, Panel, Popover, Tooltip, OverlayTrigger, Modal, Button, ButtonGroup, DropdownButton, MenuItem } from 'react-bootstrap';

const s = require('./style.css');


class Header extends React.Component<{}, {}> {

  public render() {

    return (
      <div className={s.header}>
        <Alert bsStyle={'info'}>
          <h4>title</h4>
          <p>content</p>
        </Alert>
      </div>
    );

    /*
    return (<div>
      <ButtonGroup>
        <DropdownButton id="dropdown-btn-menu" bsStyle="success" title="Dropdown">
          <MenuItem key="1">Dropdown link</MenuItem>
          <MenuItem key="2">Dropdown link</MenuItem>
        </DropdownButton>
        <Button bsStyle="info">Middle</Button>
        <Button bsStyle="info">Right</Button>
      </ButtonGroup>
    </div>);*/
  }
}

export {Header};

/*
 <NavBar>
 <NavBar.Header>
 <NavBar.Brand>
 <Link to="/">Hello</Link>
 </NavBar.Brand>
 </NavBar.Header>
 <Nav>
 <NavItem eventKey={1} href="#">Link</NavItem>
 <NavItem eventKey={2} href="#">Link</NavItem>
 <DropdownButton eventKey={3} title="Dropdown" id="basic-nav-dropdown">
 <MenuItem eventKey={3.1}>Action</MenuItem>
 <MenuItem eventKey={3.2}>Another action</MenuItem>
 <MenuItem eventKey={3.3}>Something else here</MenuItem>
 <MenuItem divider/>
 <MenuItem eventKey={3.4}>Separated link</MenuItem>
 </DropdownButton>
 </Nav>
 </NavBar>
 */
