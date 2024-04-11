import { Container } from '@mui/material';
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './/Header';
import ErrorBoundary from './common/error/ErrorBoundary';
import { CenteredSpinner } from './common/CenteredSpinner';
import { useIsUserResourcesLoading } from '../resources/useLoading';

export const Page = () => {
  const location = useLocation();
  const refreshOnPathChange = location.pathname;
  const isLoading = useIsUserResourcesLoading();

  return (
    <div
      style={{
        marginBottom: '4em',
      }}
    >
      <Header />
      <Container
        style={{
          marginTop: '2em',
        }}
      >
        <ErrorBoundary key={refreshOnPathChange}>
          {isLoading ? (
            <CenteredSpinner label="Loading user data..." />
          ) : (
            <Outlet />
          )}
        </ErrorBoundary>
      </Container>
    </div>
  );
};
