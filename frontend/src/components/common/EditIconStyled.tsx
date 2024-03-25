import styled from '@emotion/styled';
import { styleButtonIcon } from '../../utils/styleButtonIcon';
import CreateIcon from '@mui/icons-material/Create';
import { btnIconStyling } from './BtnIconStyling';

export const EditIconStyled = styled(styleButtonIcon(CreateIcon))`
  ${btnIconStyling}
`;
