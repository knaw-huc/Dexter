import React from "react"
import { getCollections } from "../Components/API"
import { Collections } from "../Model/DexterModel"

export interface AppState {
    collections: Collections[]
}

export const initAppState: AppState = {
    collections: null
}

interface SetCollections {
    type: "SET_COLLECTIONS",
    collections: Collections[]
}

export type AppAction = SetCollections

export function useAppState(): [AppState, React.Dispatch<AppAction>] {
    const [state, dispatch] = React.useReducer(reducer, initAppState)

    React.useEffect(() => {
        async function fetchCollections() {
            try {
                const result = await getCollections()
                dispatch({
                    type: "SET_COLLECTIONS",
                    collections: result
                })
            } catch(error) {
                console.log(error)
            }
        }
        fetchCollections()
    }, [])

    return [state, dispatch]
}

function reducer(state: AppState, action: AppAction): AppState {
    console.log(action, state)
    switch (action.type) {
    case "SET_COLLECTIONS":
        return setCollections(state, action)
    default:
        break
    }

    return state
}

function setCollections(state: AppState, action: SetCollections) {
    return {
        ...state,
        collections: action.collections
    }
}