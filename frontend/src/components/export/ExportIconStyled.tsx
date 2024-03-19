import styled from '@emotion/styled';
import { styleButtonIcon } from '../../utils/styleButtonIcon';
import { btnIconStyling } from '../common/BtnIconStyling';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';

export const ExportIconStyled = styled(styleButtonIcon(MoveToInboxIcon))`
  ${btnIconStyling}
`;
