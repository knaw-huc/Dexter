import { styleButtonIcon } from '../../utils/styleButtonIcon';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import { styleHoverIcon } from '../../utils/styleHoverIcon';

export const ExportIconStyled = styleHoverIcon(
  styleButtonIcon(MoveToInboxIcon),
);
