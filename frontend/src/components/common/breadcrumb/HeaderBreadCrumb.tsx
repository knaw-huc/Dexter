import React, {PropsWithChildren} from "react"
import {Breadcrumbs} from "@mui/material"
import {BreadCrumbLink} from "./BreadCrumbLink"
import Typography from "@mui/material/Typography"

export function HeaderBreadCrumb(props: PropsWithChildren) {
    return <Breadcrumbs aria-label="breadcrumb" style={{marginBottom: "1em"}}>
        <BreadCrumbLink to="/">
            Dexter
        </BreadCrumbLink>
        {props.children}
    </Breadcrumbs>
}