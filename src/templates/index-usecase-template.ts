export const templateIndexUseCase = (name: string) => `
import {
  ActionExtraReducer,
  ReduxState,
  ReduxUseCases,
} from "../../../../@types/redux/redux";

export class ${name}UseCases implements ReduxUseCases {
  fulfilled(state: ReduxState<any>, action: ActionExtraReducer<any>): void {
    throw new Error("Method not implemented.");
  }
  pending(state: ReduxState<any>): void {
    state.status = "loading";
  }
  rejected(state: ReduxState<any>, action: any): void {
    state.status = "failed";
    state.error = action.error.message ?? "Erro desconhecido";
    state.data = action.payload;
  }
}

`