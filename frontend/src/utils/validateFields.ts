import { DateTime } from 'luxon';
import { AnyObject } from 'yup/es/types';
import * as yup from 'yup';
import isUrl from './isUrl';

export const validDate = {
  message: 'Invalid ISO date  format (e.g. 1911-11-11)',
  test: (earliest: string) => {
    return DateTime.fromISO(earliest).isValid;
  },
};

export const validUrl = {
  message: 'Invalid url',
  test: (url: string) => {
    return isUrl(url);
  },
};

export const afterEarliest = {
  message: 'Latest date should be after earliest date',
  test: (latest: string, context: AnyObject) => {
    const { earliest } = context.parent;
    if (!earliest) {
      return true;
    }
    return DateTime.fromISO(latest) >= DateTime.fromISO(earliest);
  },
};

const str = yup.string();

export const validateNullableDate = str.when(earliest =>
  earliest ? str.test(validDate) : str.nullable(),
);

export const validateLatestDate = str.when(latest =>
  latest ? str.test(validDate).test(afterEarliest) : str.nullable(),
);
