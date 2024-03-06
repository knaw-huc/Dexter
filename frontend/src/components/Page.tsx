import { Container } from '@mui/material';
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './/Header';
import ErrorBoundary from './common/error/ErrorBoundary';

export const Page = () => {
  return (
    <div>
      <Header />
      <Container
        style={{
          marginTop: '2em',
        }}
      >
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </Container>
    </div>
  );
};
