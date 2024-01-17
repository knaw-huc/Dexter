import React, {useContext, useEffect, useState} from "react"
import {Source} from "../../model/DexterModel"
import {SourceListItem} from "./SourceListItem"
import styled from "@emotion/styled"
import {getSourcesWithResources} from "../../utils/API"
import {SourceForm} from "./SourceForm"
import {AddNewSourceButton} from "./AddNewSourceButton"
import {List} from "@mui/material"
import {errorContext} from "../../state/error/errorContext"
import {HeaderBreadCrumb} from "../common/breadcrumb/HeaderBreadCrumb"
import Typography from "@mui/material/Typography"
import {LastBreadCrumb} from "../common/breadcrumb/LastBreadCrumb"

export function SourceIndex() {
    const [showForm, setShowForm] = React.useState(false)
    const [sources, setSources] = useState<Source[]>()
    const [isInit, setInit] = useState(false)
    const {dispatchError} = useContext(errorContext)
    const [sourceToEdit, setSourceToEdit] = React.useState<Source>(null);

    useEffect(() => {
        async function initResources() {
            try {
                setSources(await getSourcesWithResources())
            } catch (e) {
                dispatchError(e)
            }
        }

        if (!isInit) {
            setInit(true)
            initResources()
        }
    }, [isInit])

    const handleDelete = (source: Source) => {
        setSources(sources => sources.filter(s => s.id !== source.id))
    }

    const handleEdit = (source: Source) => {
        setSourceToEdit(source)
        setShowForm(true)
    }

    function handleSaveSource(source: Source) {
        if(sourceToEdit) {
            setSources(sources => sources.map(s => s.id === source.id ? source : s))
            setSourceToEdit(null)
        } else {
            setSources(sources => [...sources, source])
        }
        setShowForm(false)
    }

    function byUpdatedAtDesc(s1: Source, s2: Source) {
        return s1.createdAt < s2.createdAt ? 1 : -1
    }

    return <>
        <div>
            <HeaderBreadCrumb />

            <div style={{float: "right"}}>
                <AddNewSourceButton
                    onClick={() => setShowForm(true)}
                />
            </div>

            <h1>Sources</h1>

        </div>
        {showForm && <SourceForm
            onClose={() => setShowForm(false)}
            onSave={handleSaveSource}
            sourceToEdit={sourceToEdit}
        />}
        {sources && (
            <List
                sx={{mt: "1em"}}
            >
                {sources
                    .sort(byUpdatedAtDesc)
                    .map((source: Source, index: number) => (
                        <SourceListItem
                            key={index}
                            source={source}
                            onDelete={() => handleDelete(source)}
                            onEdit={() => handleEdit(source)}
                        />
                    )
                )}
            </List>
        )}
    </>
}
