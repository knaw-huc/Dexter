import React from "react"
import { Languages } from "../../Model/DexterModel"

type LanguagesContentProps = {
    languages: Languages[]
}

export const LanguagesContent = (props: LanguagesContentProps) => {
    return (
        <>
            {props.languages.map((language, index) => {
                return <p key={index}>{language.refName}</p>
            })}
        </>
    )
}