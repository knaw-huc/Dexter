import { CardMedia } from '@mui/material';
import React from 'react';
import { blueGrey } from '@mui/material/colors';

export function CardHeaderImage(props: { src?: string; onClick: () => void }) {
  return (
    <span onClick={props.onClick}>
      {props.src ? (
        <CardMedia
          sx={{
            height: 140,
            cursor: 'pointer',
          }}
          image={props.src}
        />
      ) : (
        <div
          style={{
            height: '140px',
            background: blueGrey[100],
          }}
        ></div>
      )}
    </span>
  );
}
