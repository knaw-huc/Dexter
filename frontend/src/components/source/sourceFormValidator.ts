import * as yup from 'yup';
import {
  validateLatestDate,
  validateNullableDate,
} from '../../utils/validateFields';

export const sourceFormValidator = yup.object({
  title: yup.string().required('Title is required'),
  earliest: validateNullableDate,
  latest: validateLatestDate,
});
