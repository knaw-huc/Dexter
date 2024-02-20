import React from 'react';

const UNTITLED = 'Untitled';

export function Title(props: { title: string }) {
  return <>{props.title || UNTITLED}</>;
}
