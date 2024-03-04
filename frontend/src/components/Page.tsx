import { Container } from '@mui/material';
import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './/Header';
import ErrorHandler from './ErrorHandler';
import { errorContext } from '../state/error/errorContext';

export const Page = () => {
  const { errorState } = useContext(errorContext);
  return (
    <div>
      <Header />
      <Container
        style={{
          marginTop: '2em',
        }}
      >
        <ErrorHandler error={errorState.error}>
          <Outlet />
        </ErrorHandler>
      </Container>
    </div>
  );
};
