import {ServerKeyword} from "../../model/DexterModel"
import React, {useState} from "react"
import {KeywordField} from "../keyword/KeywordField"
import {ButtonWithIcon} from "../common/ButtonWithIcon"
import {FilterIconStyled} from "../common/FilterIconStyled"

export function FilterSourceByKeywords(props: {
    all: ServerKeyword[],
    selected: ServerKeyword[],
    onChangeSelected: (keys: ServerKeyword[]) => void
}) {
    const [isOpen, setOpen] = useState(!!props.selected.length)

    if (!isOpen) {
        return <FilterButton
            onClick={() => setOpen(true)}
        />
    }

    return <KeywordField
        selected={props.selected}
        onChangeSelected={props.onChangeSelected}
        suggestions={props.all}
        size="small"
    />
}

function FilterButton(props: {
    onClick: () => void
}) {
    return <ButtonWithIcon
        variant="contained"
        style={{float: "right"}}
        onClick={props.onClick}
    >
        <FilterIconStyled/>
        Keyword
    </ButtonWithIcon>
}