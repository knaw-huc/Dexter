import React from "react"
import { Keywords } from "../../Model/DexterModel"
import { getKeywords } from "../API"
import { NewKeywords } from "./NewKeywords"

export const KeywordList = () => {
    const [keywords, setKeywords] = React.useState<Keywords[]>()

    const doGetKeywords = async () => {
        const kw = await getKeywords()
        setKeywords(kw)
    }

    React.useEffect(() => {
        doGetKeywords()
    }, [])

    return (
        <>
            <NewKeywords />
            {keywords && keywords.map((keyword: Keywords, index: number) => (
                <div key={index}>{keyword.id} {keyword.val}</div>
            ))}
        </>
    )
}