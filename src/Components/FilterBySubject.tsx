import React from "react"
import { appContext } from "../State/context"

type FilterBySubjectProps = {
    selected: string,
    onChangeFilter: (selectedSubject: string) => void,
    toFilter: "Collections" | "Sources"
}

export const FilterBySubject = (props: FilterBySubjectProps) => {
    const { state } = React.useContext(appContext)

    const dropdownChangeHandler = (event: { target: { value: string } }) => {
        props.onChangeFilter(event.target.value)
        console.log(event.target.value)
    }

    const buttonClick = () => {
        props.onChangeFilter("No filter")
    }

    return (
        <div>
            <label>Filter by subject</label>
            <select value={props.selected} onChange={dropdownChangeHandler}>
                <option value={undefined}>No filter</option>
                {props.toFilter === "Collections" ? state.collections && state.collections.map((collection, i) => {
                    return (
                        <option value={collection.subject} key={i}>
                            {collection.subject}
                        </option>
                    )
                }) : state.sources && state.sources.map((source, i) => {
                    return (
                        <option value={source.subject} key={i}>
                            {source.subject}
                        </option>
                    )
                })}
            </select>
            <button onClick={buttonClick}>Reset filter</button>
        </div>
    )
}