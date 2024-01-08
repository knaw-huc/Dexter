import styled from "@emotion/styled"

export const clippedStyle = `  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  display: -webkit-box;
`
export const ClippedP = styled.p`
  ${clippedStyle}
`