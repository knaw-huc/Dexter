import React from 'react';

/**
 * Trigger submit handler on enter,
 * prevent submitting to server
 */
export function onSubmit(handleSubmit: () => Promise<void>) {
  return function (event: React.FormEvent<HTMLFormElement | HTMLInputElement>) {
    event.preventDefault();
    handleSubmit();
  };
}
