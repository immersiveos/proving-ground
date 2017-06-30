const crypto = require('crypto');
const log = console.log;
const BigNumber = require('bignumber.js');

export class BlockchainUtils {
  public static ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

  public static shortAddressFormat(address:string) {
    if (!address) return "";

    return `${address.substring(0,4)}...${address.substring(address.length-4)}`
  }

  public static networkName(id:number):string {
    switch (id) {
      case 1:
        return 'Main Ethereum network';
      case 2:
        return 'Deprecated testnet (id 2)';
      case 3:
        return ('Ropsten test network (id 3)');
      case NaN:
        log('Not connected to any network');
        break;
      default:
        return(`Test network (network id ${id})`);
    }
  }
}

export class TimeUtils {

  public static setEarliestTimeofDay(day: Date) {
    day.setHours(0);
    day.setMinutes(0);
    day.setSeconds(0);
    day.setMilliseconds(0);
  }

  public static setLatestTimeofDay(day: Date) {
    day.setHours(23);
    day.setMinutes(59);
    day.setSeconds(59);
    day.setMilliseconds(999);
  }

  public static blocksInDuration(seconds:number) {
    return Math.round(seconds / 17);
  }

  public static daysFromNow(days:number) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  }

}


