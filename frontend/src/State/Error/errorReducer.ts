import React from "react";
import { ACTIONS } from "../actions";

export interface ErrorState {
  message: string;
}

export const initErrorState: ErrorState = {
  message: "",
};

interface SetError {
  type: ACTIONS.SET_ERROR;
  message: string;
}

export type ErrorAction = SetError;

export const useErrorState = (): [ErrorState, React.Dispatch<ErrorAction>] => {
  const [state, dispatch] = React.useReducer(errorReducer, initErrorState);

  return [state, dispatch];
};

const errorReducer = (state: ErrorState, action: ErrorAction): ErrorState => {
  console.log(action, state);

  switch (action.type) {
    case ACTIONS.SET_ERROR:
      return setError(state, action);
    default:
      break;
  }

  return state;
};

function setError(state: ErrorState, action: SetError) {
  return {
    ...state,
    message: action.message,
  };
}
