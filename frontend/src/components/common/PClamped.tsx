import styled from "@emotion/styled"

export const clampedStyle = `  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  display: -webkit-box;
  margin-bottom: 0;
  margin-top: 0.25em;
`
export const PClamped = styled.p`
  ${clampedStyle}
`