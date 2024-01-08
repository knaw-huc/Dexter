import {FC} from "react"
import styled from "@emotion/styled"

export const styleInlineIcon = (component: FC<{[x:string]: any}>) => styled(component)`
  vertical-align: bottom;
`