import { styleButtonIcon } from '../../utils/styleButtonIcon';
import CreateIcon from '@mui/icons-material/Create';
import { styleHoverIcon } from '../../utils/styleHoverIcon';

export const EditIconStyled = styleHoverIcon(styleButtonIcon(CreateIcon));
