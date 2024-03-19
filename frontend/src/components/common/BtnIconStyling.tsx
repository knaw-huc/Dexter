type IconStyledProps = {
  hoverColor?: string;
};

export const btnIconStyling = `
  font-size: 1.4em;
  &:hover {
    cursor: pointer;
    color: ${(props: IconStyledProps) =>
      props.hoverColor ? props.hoverColor : ''};
  }
`;
