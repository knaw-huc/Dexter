import { User } from '../model/DexterModel';
import { ReferenceStyle } from '../components/reference/ReferenceStyle';

export const defaultUser: User = {
  name: '',
  settings: {
    referenceStyle: ReferenceStyle.apa,
  },
};
