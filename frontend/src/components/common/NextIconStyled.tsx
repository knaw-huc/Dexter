import { styleButtonIcon } from '../../utils/styleButtonIcon';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { styleHoverIcon } from '../../utils/styleHoverIcon';

export const NextIconStyled = styleHoverIcon(
  styleButtonIcon(ArrowForwardIosIcon),
);
