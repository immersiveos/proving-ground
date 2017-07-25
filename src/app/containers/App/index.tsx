import * as React from 'react';
import * as $ from 'jquery';

import {Header} from 'components';
import {Helmet} from 'react-helmet';
import {Blockchain} from '../../blockchain/blockchain';
import {BallotsRegistry} from '../../blockchain/ballotsregistry';

const style = require('./style.css');
const log = console.log;
const appConfig = require('../../../../config/main');

class App extends React.Component<void, void> {

  componentDidMount () {
    log(`Clientside loaded.`);
    $(window).on('load', () => {
      log(`Window loaded. Init blockchain....`);
      Blockchain.InitBlockchain().then(() => {
        BallotsRegistry.InitBallotsRegistry(appConfig.ballotsRegistryAddress);
      }).catch( (reason) => {
        log(`Failed to load registry: ${reason}`);
      });
    });
  }

  public render() {
    return (
      <section className={style.AppContainer}>
        <Helmet {...appConfig.app} {...appConfig.app.head}/>
        {this.props.children}
      </section>
    );
  }
}

export { App };

