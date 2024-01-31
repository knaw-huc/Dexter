import {FC} from "react"
import styled from "@emotion/styled"

export const styleButtonIcon = (component: FC<{[x:string]: any}>) => styled(component, {
    shouldForwardProp: (prop) => prop !== "hoverColor"
})`
  margin-top: -0.15em;
  margin-right: 0.4em;
`