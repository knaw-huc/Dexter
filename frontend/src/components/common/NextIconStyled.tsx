import styled from '@emotion/styled';
import { styleButtonIcon } from '../../utils/styleButtonIcon';
import { btnIconStyling } from './BtnIconStyling';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export const NextIconStyled = styled(styleButtonIcon(ArrowForwardIosIcon))`
  ${btnIconStyling}
`;
