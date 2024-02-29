import React from 'react';

export function HighlightedLabel(props: {
  toMatch: string;
  text: string;
}): JSX.Element {
  const pattern = `(.*)(${props.toMatch})(.*)`;
  const matches = props.text.match(pattern);
  return matches ? (
    <>
      {matches[1]}
      <strong>{matches[2]}</strong>
      {matches[3]}
    </>
  ) : (
    <>{props.text}</>
  );
}
