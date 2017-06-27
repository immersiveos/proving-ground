const crypto = require('crypto');
const log = console.log;
const BigNumber = require('bignumber.js');

export class BlockchainUtils {
  public static ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';


  public static shortAddressFormat(address:string) {
    if (!address) return "";

    return `${address.substring(0,4)}...${address.substring(address.length-4)}`
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


