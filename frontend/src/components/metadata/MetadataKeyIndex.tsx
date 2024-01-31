import React, {useContext, useEffect, useState} from "react"
import {getMetadataKeys} from "../../utils/API"
import {errorContext} from "../../state/error/errorContext"
import {ResultMetadataKey} from "../../model/DexterModel"
import {HeaderBreadCrumb} from "../common/breadcrumb/HeaderBreadCrumb"
import {AddNewResourceButton} from "../source/AddNewResourceButton"
import {MetadataKeyListItem} from "./MetadataKeyListItem"
import {MetadataKeyForm} from "./MetadataKeyForm"
import {ErrorBoundary} from "../common/ErrorBoundary"

export function MetadataKeyIndex() {
    const [keys, setKeys] = useState<ResultMetadataKey[]>()
    const {dispatchError} = useContext(errorContext)
    const [isFormOpen, setFormOpen] = useState(false)
    const [toEdit, setToEdit] = useState<ResultMetadataKey>()

    useEffect(() => {
        getMetadataKeys()
            .then(k => setKeys(k))
            .catch(dispatchError)
    }, [])

    function handleEditClick(toEdit: ResultMetadataKey) {
        setFormOpen(true)
        setToEdit(toEdit)
    }

    function handleSavedKey(key: ResultMetadataKey) {
        if(toEdit) {
            setKeys(keys.map(k => k.id === key.id ? key : k))
            setToEdit(null)
        } else {
            setKeys([...keys, key])
        }
        setFormOpen(false)
    }

    return <>
        <div>
            <HeaderBreadCrumb/>

            <div style={{float: "right"}}>
                <AddNewResourceButton
                    title="New metadata field"
                    onClick={() => setFormOpen(true)}
                />
            </div>

            <h1>Custom metadata fields</h1>

        </div>

        <ErrorBoundary>
            {keys?.map((key, i) =>
                <MetadataKeyListItem
                    key={i}
                    metadataKey={key}
                    onDeleted={() => setKeys(keys.filter(k => k.id !== key.id))}
                    onEditClick={() => handleEditClick(key)}
                />
            )}
        </ErrorBoundary>
        {isFormOpen && <MetadataKeyForm
            inEdit={toEdit}
            onSaved={handleSavedKey}
            onClose={() => setFormOpen(false)}
        />}
    </>
}