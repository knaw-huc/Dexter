import styled from "@emotion/styled"
import React from "react"
import Button from "react-bootstrap/Button"
import { collectionsContext } from "../State/Collections/collectionContext"
import { sourcesContext } from "../State/Sources/sourcesContext"

type FilterBySubjectProps = {
    selected: string,
    onChangeFilter: (selectedSubject: string) => void,
    toFilter: "Collections" | "Sources"
}

const ButtonStyled = styled(Button)`
    margin-left: 10px;
`

const SelectStyled = styled.select`
    margin-left: 5px;
`

export const FilterBySubject = (props: FilterBySubjectProps) => {
    const { collectionsState } = React.useContext(collectionsContext)
    const { sourcesState } = React.useContext(sourcesContext)

    const dropdownChangeHandler = (event: { target: { value: string } }) => {
        props.onChangeFilter(event.target.value)
        console.log(event.target.value)
    }

    const buttonClick = () => {
        props.onChangeFilter("No filter")
    }

    return (
        <div>
            <label>Filter by subject:</label>
            <SelectStyled value={props.selected} onChange={dropdownChangeHandler}>
                <option value={undefined}>No filter</option>
                {props.toFilter === "Collections" ? collectionsState.collections && collectionsState.collections.map((collection, i) => {
                    return (
                        <option value={collection.subject} key={i}>
                            {collection.subject}
                        </option>
                    )
                }) : sourcesState.sources && sourcesState.sources.map((source, i) => {
                    return (
                        <option value={source.subject} key={i}>
                            {source.subject}
                        </option>
                    )
                })}
            </SelectStyled>
            <ButtonStyled onClick={buttonClick}>Reset filter</ButtonStyled>
        </div>
    )
}