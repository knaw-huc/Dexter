import React, {useState} from "react"
import {ServerKeyword} from "../../model/DexterModel"
import {deleteKeyword, getKeywords} from "../../utils/API"
import {KeywordForm} from "./KeywordForm"
import {KeywordList} from "./KeywordList"

export const KeywordsPage = () => {
    const [keywords, setKeywords] = useState<ServerKeyword[]>([])

    React.useEffect(() => {
        doGetKeywords()
    }, [])

    const doGetKeywords = async () => {
        const kw = await getKeywords()
        setKeywords(kw)
    }

    const handleDelete = (keyword: ServerKeyword) => {
        const warning = window.confirm(
            "Are you sure you wish to delete this keyword?"
        )

        if (warning === false) return

        deleteKeyword(keyword.id).then(
            () => doGetKeywords()
        )
    }

    return <>
        <KeywordForm
            setKeywords={setKeywords}
        />
        <div style={{marginTop: "1em"}}>
            <KeywordList
                keywords={keywords}
                onDelete={handleDelete}
            />
        </div>
    </>
}

