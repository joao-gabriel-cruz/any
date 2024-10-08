export const templateUtils = () => `
import { AsyncThunk } from "@reduxjs/toolkit";
import { ReduxUseCases } from "../../@types/redux/redux";

interface CombineProps {
  useCase: ReduxUseCases;
  extraReducers: AsyncThunk<any, any, any>;
}

export const combineUseCasesWithExtraReducers = (props: CombineProps) => {
  const { useCase, extraReducers } = props;
  const {
    fulfilled: fulfilledUseCase,
    pending: pendingUseCase,
    rejected: rejectedUseCase,
  } = useCase;

  const {
    pending: extraPending,
    fulfilled: extraFulfilled,
    rejected: extraReject,
  } = extraReducers;

  return {
    pending: {
      useCase: pendingUseCase,
      extra: extraPending,
    },
    fulfilled: {
      useCase: fulfilledUseCase,
      extra: extraFulfilled,
    },
    rejected: {
      useCase: rejectedUseCase,
      extra: extraReject,
    },
  };
};
`