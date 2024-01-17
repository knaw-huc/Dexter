import {BreadCrumbLink} from "../common/breadcrumb/BreadCrumbLink"
import React from "react"
import {CorpusIcon} from "./CorpusIcon"
import {ServerResultCorpus} from "../../model/DexterModel"

export function CorpusParentBreadCrumbLink(props: {parent: ServerResultCorpus}) {
    return <BreadCrumbLink
        to={`/corpora/${props.parent.id}`}
    >
        <CorpusIcon/>
        {props.parent.title}
    </BreadCrumbLink>
}