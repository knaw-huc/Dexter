import {ResponseError, ResponseErrorParams} from "./API"

export type ErrorBody = {
    message: string
}
export function validateResponse(params: ResponseErrorParams) {
    if (!params.response.ok) {
        throw new ResponseError(params)
    }
}