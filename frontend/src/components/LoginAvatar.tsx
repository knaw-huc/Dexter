import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Avatar from "@mui/material/Avatar"
import LoginIcon from "@mui/icons-material/Login"
import * as React from "react"
import {useContext, useEffect, useState} from "react"
import {login} from "../utils/API"
import {userContext} from "../state/user/userContext"
import {errorContext} from "../state/error/errorContext"

export function LoginAvatar() {
    const [isLoggingIn, setLoggingIn] = useState(false)
    const {dispatchUser} = useContext(userContext)
    const {dispatchError} = useContext(errorContext)

    useEffect(() => {
        if (!isLoggingIn) {
            return
        }
        tryLogin()
    }, [isLoggingIn])

    useEffect(() => {
        tryLogin()
    }, [])

    function tryLogin() {
        login()
            .then(
                r => dispatchUser({username: r.name})
            ).catch(
                e => {
                    if(e.response.status === 401) {
                        dispatchError(new Error("Could not login: username & password incorrect"))
                    } else {
                        dispatchError(new Error("Error while logging in"))
                    }
                }
        )
    }

    return <Box sx={{flexGrow: 0}}>
        <IconButton
            onClick={() => setLoggingIn(true)}
            sx={{p: 0}}
        >
            <Avatar>
                <LoginIcon/>
            </Avatar>
        </IconButton>
    </Box>
}