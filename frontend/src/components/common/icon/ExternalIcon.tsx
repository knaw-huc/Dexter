import { styleButtonIcon } from '../../../utils/styleButtonIcon';
import styled from '@emotion/styled';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
const OpenInNewOutlinedIconStyled = styled(OpenInNewOutlinedIcon)`
  margin-left: 0.4em;
  font-size: 1.2em;
  padding-top: 0.25em;
`;
export const ExternalIcon = styleButtonIcon(OpenInNewOutlinedIconStyled);
