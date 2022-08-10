import { getCollections } from "../Components/API"

export async function doGetCollections() {
    const response = await getCollections()
    return response
}