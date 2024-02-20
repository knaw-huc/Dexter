import React from 'react';

export const UNTITLED = 'Untitled';

export function Title(props: { title: string }) {
  return <>{props.title || UNTITLED}</>;
}
