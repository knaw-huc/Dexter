import React from "react"
import { appContext } from "../../State/context"

type CollectionFilterProps = {
    selected: any,
    onChangeFilter: any
}

export const CollectionFilter = (props: CollectionFilterProps) => {
    const { state } = React.useContext(appContext)

    const dropdownChangeHandler = (event: any) => {
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
                {state.collections && state.collections.map((collection, i) => {
                    return (
                        <option value={collection.subject} key={i}>
                            {collection.subject}
                        </option>
                    )
                })}
            </select>
            <button onClick={buttonClick}>Reset filter</button>
        </div>
    )
}