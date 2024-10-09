"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.templateType = void 0;
const templateType = () => `
/* eslint-disable prettier/prettier */
export type ReduxStateStatus = "idle" | "loading" | "succeeded" | "failed";
import { ActionReducerMapBuilder, AsyncThunk, createAsyncThunk, PayloadAction, SerializedError } from "@reduxjs/toolkit";

export type ErrorExtraReducer<T> = PayloadAction<
  unknown,
  any,
  {
    arg: any;
    requestId: string;
    requestStatus: "rejected";
    aborted: boolean;
    condition: boolean;
  } & (
    | {
      rejectedWithValue: true;
    }
    | ({
      rejectedWithValue: false;
    } & object)
  ),
  SerializedError
>;


type RequestStatus = "pending" | "fulfilled" | "rejected";

export type PendingExtraReducer = PayloadAction<
  undefined,
  string,
  {
    arg: any;
    requestId: string;
    requestStatus: "pending";
  },
  never
>;

export type ActionExtraReducer<T> = PayloadAction<
  T,
  string,
  {
    arg: any;
    requestId: string;
    requestStatus: RequestStatus;
  },
  never
>;

export abstract class ReduxUseCases {
  abstract fulfilled(state: any, action: ActionExtraReducer<any>): void;
  abstract pending(state: any, action: ActionExtraReducer<typeof state>): void;
  abstract rejected(state: any, action: any): void;
}



export type ReduxModule<T> = (builder: ActionReducerMapBuilder<T>) => void;

export type ReduxState<T> = {
  old: T | null;
  data: T;
  error: string;
  status: ReduxStateStatus;
} 
`;
exports.templateType = templateType;
//# sourceMappingURL=type-template.js.map