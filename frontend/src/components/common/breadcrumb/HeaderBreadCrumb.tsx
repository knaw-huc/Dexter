import React, {PropsWithChildren} from "react"
import {Breadcrumbs} from "@mui/material"
import {BreadCrumbLink} from "./BreadCrumbLink"
import NavigateNextOutlinedIcon from '@mui/icons-material/NavigateNextOutlined';
export function HeaderBreadCrumb(props: PropsWithChildren) {
    return <Breadcrumbs
        aria-label="breadcrumb"
        style={{marginBottom: "1em"}}
        separator={<NavigateNextOutlinedIcon fontSize="small" />}
    >
        <BreadCrumbLink to="/">
            Dexter
        </BreadCrumbLink>
        {props.children}

        {/* Display separator after last breadcrumb: */}
        <span/>
    </Breadcrumbs>
}