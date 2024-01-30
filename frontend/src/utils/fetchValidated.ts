import {headers} from "./API"
import {validateResponse} from "./validateResponse"

export async function fetchValidated(path: string) {
    const response = await fetch(path, {
        headers,
        method: "GET"
    })
    validateResponse({response})
    return response.json()
}