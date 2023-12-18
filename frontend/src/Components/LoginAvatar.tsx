import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Avatar from "@mui/material/Avatar"
import LoginIcon from "@mui/icons-material/Login"
import * as React from "react"
import {useContext, useEffect, useState} from "react"
import {login} from "../utils/API"
import {userContext} from "../State/User/userContext"
import {errorContext} from "../State/Error/errorContext"

export function LoginAvatar() {
    const [isLoggingIn, setLoggingIn] = useState(false)
    const {setUser} = useContext(userContext)
    const {setError} = useContext(errorContext)

    useEffect(() => {
        if (!isLoggingIn) {
            return
        }
        login()
            .then(
                r => setUser({username: r.name})
            ).catch(
                () => setError(new Error("Could not login, username/password incorrect"))
            )
    }, [isLoggingIn])

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