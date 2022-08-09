import React from "react"
import { useParams } from "react-router-dom"
import { Sources } from "../../Model/DexterModel"
import { getSourceById } from "../API"

export const SourceItemContent = () => {
    const [source, setSource] = React.useState<Sources>(null)
    const params = useParams()

    const doGetSourceById = async (id: number) => {
        const response: any = await getSourceById(id)
        setSource(response)
    }

    doGetSourceById(parseInt(params.sourceId))

    return (
        <div>
            {source &&
                <>
                    <p>Title: {source.title}</p>
                    <p>Description: {source.description}</p>
                    <p>Creator: {source.creator}</p>
                    <p>Subject: {source.subject}</p>
                    <p>Rights: {source.rights}</p>
                    <p>Access: {source.access}</p>
                    <p>Created: {source.created}</p>
                    <p>Spatial: {source.spatial}</p>
                    <p>Temporal: {source.temporal}</p>
                    <p>Language: {source.language}</p>
                </>
            }
        </div>
    )
}