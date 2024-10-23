import moment from 'moment';

export enum Range {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

export class DateUtils {
  static validateRange(range: string) {
    let isValid: boolean;

    switch (range) {
      case Range.DAY:
        isValid = true;
        break;

      case Range.WEEK:
        isValid = true;
        break;

      case Range.MONTH:
        isValid = true;
        break;

      case Range.YEAR:
        isValid = true;
        break;

      default:
        isValid = false;
        break;
    }

    return isValid;
  }

  static getRange(range: Range, date: string) {
    let rangeValues: { start: string; end: string };

    switch (range) {
      case Range.DAY:
        rangeValues = this.dayRange(date);
        break;

      case Range.WEEK:
        rangeValues = this.weekRange(date);
        break;

      case Range.MONTH:
        rangeValues = this.monthRange(date);
        break;

      case Range.YEAR:
        rangeValues = this.yearRange(date);
        break;

      default:
        rangeValues = { start: moment().format(), end: moment().format() };
        break;
    }

    return rangeValues;
  }

  static dayRange(date: string) {
    const start = moment(date).startOf('day').format();
    const end = moment(date).endOf('day').format();

    return { start, end };
  }

  static weekRange(date: string) {
    const start = moment(date).startOf('week').format();
    const end = moment(date).endOf('week').format();

    return { start, end };
  }

  static monthRange(date: string) {
    const start = moment(date).startOf('month').format();
    const end = moment(date).endOf('month').format();

    return { start, end };
  }

  static yearRange(date: string) {
    const start = moment(date).startOf('year').format();
    const end = moment(date).endOf('year').format();

    return { start, end };
  }

  static addMins(amount: number) {
    const time = moment().add(amount, 'minutes').format();

    return time;
  }
}
