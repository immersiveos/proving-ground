import * as React from 'react';
import * as $ from 'jquery';

import {Header} from 'components';
import {Helmet} from 'react-helmet';
import {Blockchain} from '../../blockchain/blockchain';
import {ImmersiveToken} from '../../blockchain/immersivetoken';

const style = require('./style.css');
const log = console.log;
const appConfig = require('../../../../config/main');

class App extends React.Component<void, void> {

  componentDidMount () {
    log(`Client-side-loaded - init block-chain....`);
    $(window).on('load', () => {
      log(`Window-loaded - init block-chain....`);
      Blockchain.InitBlockchain().then(() => {
        ImmersiveToken.InitToken();
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

