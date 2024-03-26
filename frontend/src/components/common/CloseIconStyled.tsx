import { styleButtonIcon } from '../../utils/styleButtonIcon';
import CloseIcon from '@mui/icons-material/Close';
import { styleHoverIcon } from '../../utils/styleHoverIcon';

export const CloseIconStyled = styleHoverIcon(styleButtonIcon(CloseIcon));
