import { ResponseError, ResponseErrorParams } from './API';

export type ErrorBody = {
  message: string;
};
export async function validateResponse(params: ResponseErrorParams) {
  if (!params.response.ok) {
    throw await ResponseError.from(params);
  }
}
