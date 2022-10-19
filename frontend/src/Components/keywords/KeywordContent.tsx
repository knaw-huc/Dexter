import React from "react"
import { Keywords } from "../../Model/DexterModel"

type KeywordContentProps = {
    keywords: Keywords[]
}

export const KeywordContent = (props: KeywordContentProps) => {

    return (
        <>
            {props.keywords.map((keyword, index) => {
                return <p key={index}>{keyword.val}</p>
            })}
        </>
    )
}